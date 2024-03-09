const router = require('express').Router();
const passport = require('../services/passport');
const { registerUser, loginUser } = require('../controllers/auth');
const { verifyToken } = require('../middlewares/verifyToken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

router.get('/', (req, res) => {
    res.send("Welcome to FB Helpdesk API!")
});

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile', 'pages_show_list', 'pages_messaging', 'pages_manage_metadata']
}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: `${process.env.CLIENT_URL}/login?success=false`,
        session: false
    }), (req, res) => {
        User.findOne({id: req.user._id}).then(user => {
            if(user && user.accessToken == null){
                user.accessToken = req.accessToken
                fetch(`${process.env.FACEBOOK_API_URL}/me/accounts?access_token=${req.accessToken}`)
                    .then(response => response.json())
                    .then(data => {
                        user.page_id = data.data[0].id;
                        user.page_name = data.data[0].name;
                        user.page_accessToken = data.data[0].access_token
                        user.save().then(() => {
                            return res.redirect(`${process.env.CLIENT_URL}/manage`)
                        })
                    })
            }else{
                return res.redirect(`${process.env.CLIENT_URL}/login?success=false`)
            }
        })
});

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.get('/auth/verify', verifyToken, (req, res) => {
    if(req.user.accessToken == null) {
        res.status(200).json({ success: true, message: "Token is valid", connected: false, user: {email: req.user.email, name: req.user.name}})
    }else{
        res.status(200).json({ success: true, message: "Token is valid", connected: true, page_id: req.user.page_id, page_name: req.user.page_name, user: {email: req.user.email, name: req.user.name}})
    }
})

router.get('/delete', verifyToken, (req, res) => {
    if(req.user.accessToken != null){
        User.findOneAndUpdate({_id: req.user._id}, {accessToken: null, page_id: null, page_accessToken: null, page_name: null}).then((user) => {
            res.status(200).json({ success: true, message: "User disconnected"})
        })
    }
})

router.post('/invite', verifyToken, (req, res) => {
    if(req.user.accessToken != null){
        User.findOne({email: req.body.email}).then(user => {
            if(user && user.accessToken != null){
                res.status(200).json({ success: false, message: "User already exists"})
            }else if(user){
                user.accessToken = req.user.accessToken;
                user.page_id = req.user.page_id;
                user.page_accessToken = req.user.page_accessToken;
                user.page_name = req.user.page_name;
                user.save().then(() => {
                    res.status(200).json({ success: true, message: "User added successfully"})
                })
            }else{
                let newUser = new User({
                    email: req.body.email,
                    accessToken: req.user.accessToken,
                    page_id: req.user.page_id,
                    page_accessToken: req.user.page_accessToken,
                    page_name: req.user.page_name
                })
                newUser.save().then(() => {
                    res.status(200).json({ success: true, message: "User added successfully"})
                })
            }
        })
    }
})

router.get('/page', verifyToken, (req, res) => {
    if(req.user && req.user.page_id != null){
        res.status(200).json({ success: true, page_id: req.user.page_id, page_name: req.user.page_name})
    }else{
        res.status(404).json({ success: false, message: "User not found" })
    }
})

router.get('/conversations', verifyToken, (req, res) => {
    Conversation.find({page_id: req.user.page_id}).then(conversations => {
        res.status(200).json({ success: true, conversations: conversations, page_id: req.user.page_id })
    })
})
router.post('/conversations/reply', verifyToken, (req, res) => {
    Conversation.findOne({ _id: req.body.conversationId }).then(conversation => {
        fetch(`${process.env.FACEBOOK_API_URL}/${req.user.page_id}/messages?access_token=${req.user.page_accessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_type: 'RESPONSE',
                recipient: {
                    id: conversation.sender_id
                },
                message: {
                    text: req.body.message
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                if(data.message_id){
                    conversation.messages.push({
                        message_id: data.message_id,
                        message: req.body.message,
                        timestamp: new Date().getTime(),
                        position: 'right'
                    })
                    conversation.lastUpdated = new Date();
                    conversation.save().then(() => {
                        res.status(200).json({ success: true, message: "Message sent", conversation: conversation })
                    })
                }
            })
    })
})

router.post('/messaging-webhook', (req, res) => {
    if (req.body.object === "page") {
        let data = req.body.entry[0].messaging[0];
        let senderId = data.sender.id;
        let message = data.message.text;
        let timestamp = data.timestamp;
        let pageId = data.recipient.id;
        let messageId = data.message.mid;

        Conversation.findOne({
            page_id: pageId,
            sender_id: senderId
        }).then(async (conversation) => {
            if (conversation) {
                conversation.messages.push({
                    message_id: messageId,
                    message: message,
                    timestamp: timestamp,
                })
                conversation.lastUpdated = new Date();
                conversation.save().then(() => {
                    console.log("Conversation updated")
                    req.io.emit(`new-message-${pageId}`)
                    res.status(200).send("EVENT_RECEIVED");
                })
            } else {
                const user = await User.findOne({page_id: pageId})
                fetch(`${process.env.FACEBOOK_API_URL}/${senderId}?fields=first_name,last_name,profile_pic&access_token=${user.page_accessToken}`)
                    .then(response => response.json())
                    .then(data => {
                        let newConversation = new Conversation({
                            page_id: pageId,
                            sender_id: senderId,
                            sender_name: `${data.first_name} ${data.last_name}`,
                            sender_pic: data.profile_pic,
                            messages: [{
                                message_id: messageId,
                                message: message,
                                timestamp: timestamp,
                            }],
                            lastUpdated: new Date()
                        })
                        newConversation.save().then(() => {
                            console.log("New conversation created")
                            req.io.emit(`new-message-${pageId}`)
                            res.status(200).send("EVENT_RECEIVED");
                        })
                    })
            }
        })
    } else {
        res.sendStatus(404);
    }
})

router.get("/messaging-webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === "mytoken") {
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
    }
});

module.exports = router;