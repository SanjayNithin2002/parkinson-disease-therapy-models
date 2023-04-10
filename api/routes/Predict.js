var express = require('express');
var Tesseract = require('tesseract.js');
var Samples = require('../models/Samples');
var Users = require('../models/Users');
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
    var userID = req.body.userID;
    var sampleID = req.body.sampleID;
    Samples.findById(sampleID).exec()
        .then(sampleDoc => {
            var score = sampleDoc.score;
            var value = sampleDoc.value;
            Tesseract.recognize(
                filepath,
                'eng'
            ).then(({ data: { text } }) => {
                    if(sampleDoc.value === text.replace(/\n/g, "")){
                    Users.findByIdAndUpdate(req.params.userID, { $inc: { score: score }, $push: { "completed": sampleID } }, { new: true }).exec()
                        .then(docs => {
                            res.status(201).json({
                                message: "Success"
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        });
                }else{
                    res.status(200).json({
                        message : "Failure"
                    })

                }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

}).catch(err => {
    res.status(500).json({
        error: err
    })
});




});

module.exports = router;