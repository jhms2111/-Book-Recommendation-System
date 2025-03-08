const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../dataBase/models/User');
require('dotenv').config();

// Verificação se as variáveis de ambiente estão definidas
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("❌ ERRO: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não estão definidos!");
    process.exit(1); // Encerra o processo se as credenciais não estiverem configuradas
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let usuario = await User.findOne({ googleId: profile.id });
        if (!usuario) {
            usuario = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id
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
    try {
        const usuario = await User.findById(id);
        done(null, usuario);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
