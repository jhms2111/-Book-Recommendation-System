const multer = require('multer');
const path = require('path');

// Configuração de armazenamento de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename); // Nome único para cada arquivo
    },
});

// Verifica se o arquivo é uma imagem
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Somente imagens são permitidas'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
