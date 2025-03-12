require("dotenv").config({ path: __dirname + "/.env" }); // ✅ Carregar o .env corretamente
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./dataBase/models/User");

const mongoURI = process.env.MONGO_URI; // 🔹 Pega a URI do MongoDB

if (!mongoURI) {
    console.error("❌ ERRO: A variável de ambiente MONGO_URI não foi encontrada!");
    process.exit(1); // Sai do script
}

// 🔹 Conectando ao MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Conectado ao MongoDB!"))
    .catch(err => {
        console.error("❌ Erro ao conectar ao MongoDB:", err);
        process.exit(1);
    });

// Função para criar o admin
async function createAdmin() {
    try {
        const existingAdmin = await User.findOne({ email: "admin11@exemplo.com" });
        if (existingAdmin) {
            console.log("✅ Usuário admin já existe.");
            mongoose.connection.close();
            return;
        }

        const hashedPassword = await bcrypt.hash("SenhaSegura123", 10);

        const adminUser = new User({
            name: "Administrador",
            email: "admin11@exemplo.com",
            senha: hashedPassword,
            role: "admin",
        });

        await adminUser.save();
        console.log("🎉 Usuário admin criado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar admin:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Executar a função
createAdmin();
