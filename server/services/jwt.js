const jwt = require("jsonwebtoken");

module.exports = {
    generateToken: async (user) => {
        let payload = {
            user: {
                id: user.id,
            },
        };

        let token = await jwt.sign(payload, process.env.SECRET);
        return token;
    },
    decodeToken:(token) =>{
        jwt.verify(token, process.env.SECRET, (err, authData) => {
            if (err) {
                console.log(err);
            } else {
                return authData.user.id;
            }
        });
    }
};