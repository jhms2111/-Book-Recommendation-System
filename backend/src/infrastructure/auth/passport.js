const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../dataBase/models/User'); // Certifique-se de que está correto!
require('dotenv').config();

// Verifique se as variáveis de ambiente estão carregadas
console.log("🔍 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("🔍 GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "EXISTS" : "MISSING");

// Definir o `redirect_uri` dinamicamente para produção e desenvolvimento
const CALLBACK_URL = process.env.NODE_ENV === "production"
    ? "https://book-recommendation-system-9uba.onrender.com/auth/google/callback"
    : "http://localhost:5000/auth/google/callback";

console.log("🔍 CALLBACK_URL:", CALLBACK_URL);

// Configuração do Passport com Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL, // O callback URL agora está corretamente definido
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("✅ Usuário autenticado com Google:", profile.emails[0].value);
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
        console.error("❌ ERRO AO AUTENTICAR:", error);
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
