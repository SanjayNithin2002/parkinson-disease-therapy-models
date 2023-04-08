var express = require('express');
var multer = require('multer');
var PythonShell = require('python-shell').PythonShell;
var clearDirectory = require('../middleware/clearDirectory');
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
    let options = {
        args: [filepath]
    };
    PythonShell.run('shell.py', options).then(messages => {
        res.status(200).json({
            predictedClass: messages[2]
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.post("/clear", (req, res, next) => {
    clearDirectory('./uploads/');
    res.status(201).json({
        message: "Uploads Directory Cleared"
    })
})

module.exports = router;