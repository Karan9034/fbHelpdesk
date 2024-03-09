const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    page_id: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    sender_name: {
        type: String,
        required: true
    },
    sender_pic: {
        type: String,
        required: true
    },
    messages: [
        {
            message_id: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                required: true
            },
            position: {
                type: String,
                default: 'left',
                required: true
            }
        }
    ],
    lastUpdated: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Conversation', conversationSchema)