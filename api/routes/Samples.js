var mongoose = require('mongoose');
var express = require('express');
var Samples = require('../models/Samples');
var Users = require('../models/Users');
var router = express.Router();

router.get("", (req, res, next) => {
    Users.findById(req.body.userID).exec()
        .then(docs => {
            Samples.find({ _id: { $nin: docs.completed }, score: req.body.score }).select("_id url score value").exec()
                .then(doc => {
                    res.status(200).json({
                        count : doc.length,
                        samples : doc
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        })
});


router.post("/", (req, res, next) => {
    var sample = new Samples({
        _id : new mongoose.Types.ObjectId(),
        url: req.body.url,
        score: req.body.score,
        value: req.body.value
    });
    sample.save()
        .then(docs => {
            res.status(201).json({
                message: "Saved Successfully"
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})



module.exports = router;  