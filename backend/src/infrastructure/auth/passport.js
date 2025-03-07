const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../dataBase/models/User');
require('dotenv').config();

const credentials = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

passport.use(new GoogleStrategy({
    clientID: credentials.clientID,
    clientSecret: credentials.clientSecret,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let usuario = await User.findOne({ googleId: profile.id });
        if (!usuario) {
            usuario = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id // Armazena o googleId
            });
            await usuario.save();
        }
        done(null, usuario);
    } catch (error) {
        done(error);
    }
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await User.findById(id);
    done(null, usuario);
});
