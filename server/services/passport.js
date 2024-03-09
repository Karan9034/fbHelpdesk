const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, id);
})

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, cb) => {
        req.accessToken = accessToken;
        cb(null, profile)
    }
));

module.exports = passport;