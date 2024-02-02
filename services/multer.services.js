const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const imgSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null, imgSuffix + '_' + file.originalname)
    }
})
const upload = multer({ storage: storage });

module.exports = upload;
