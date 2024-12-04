const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../database/models/User');
require('dotenv').config();

const credentials = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

// Usando a GoogleStrategy para autenticação
passport.use(new GoogleStrategy({
    clientID: credentials.clientID,
    clientSecret: credentials.clientSecret,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let usuario = await User.findOne({ googleId: profile.id });
        if (!usuario) {
            // Se o usuário não existe, cria um novo
            usuario = new User({
                name: profile.displayName,  // Usando 'name' ao invés de 'nome'
                email: profile.emails[0].value,
                googleId: profile.id  // Armazenando o googleId para login futuro
            });
            await usuario.save();
        }
        done(null, usuario);  // Finaliza a autenticação com o usuário
    } catch (error) {
        done(error);  // Se houver erro, passa para o próximo callback
    }
}));

// Serializando o usuário (salvando no cookie da sessão)
passport.serializeUser((usuario, done) => {
    done(null, usuario.id);  // Armazenando o id do usuário na sessão
});

// Deserializando o usuário (recuperando da sessão)
passport.deserializeUser(async (id, done) => {
    const usuario = await User.findById(id);
    done(null, usuario);  // Retorna o usuário para o Passport
});
