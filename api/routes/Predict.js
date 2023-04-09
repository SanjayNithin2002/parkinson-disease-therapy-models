var express = require('express');
var Tesseract = require('tesseract.js');
var multer = require('multer');
var router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)

    }
});

const fileFilter = (req, file, cb) => {
    //accept
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    //reject
    else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

router.post("/", upload.single('predictImage'), (req, res, next) => {
    var filepath = req.file.path;
    Tesseract.recognize(
        filepath,
        'eng'
    ).then(({ data: { text } }) => {
        res.status(200).json({
            "predictedClass" : text.substring(0, text.length - 1)
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;