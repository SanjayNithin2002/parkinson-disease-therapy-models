const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Users = require('../models/Users');
const Samples = require("../models/Samples");

router.post("/sendotp", (req, res, next) => {
    const otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    const mailOptions = {
        from: 'schoolportal@vit.edu.in',
        to: req.body.email,
        subject: "Verify your OTP for Parkinson's Disease Application",
        text: 'Your OTP for the app is ' + otp
    };
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAIL,
            pass: process.env.NODEMAIL_PASSWORD
        }
    })
        .sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.status(201).json({
                    message: "OTP Sent Successfully",
                    otp: otp
                });
            }
        });
});
router.post("/signup", (req, res, next) => {
    Users.find({ email: req.body.email }).exec()
        .then(docs => {
            if (docs.length > 0) {
                res.status(422).json({
                    message: "Email exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new Users({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(docs => {
                                res.status(201).json({
                                    message: "User Created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

});

router.post("/login", (req, res, next) => {
    Users.find({ email: req.body.email }).exec()
        .then(docs => {
            if (docs.length < 1) {
                res.status(401).json({
                    message: "Auth Failed"
                });
            } else {
                bcrypt.compare(req.body.password, docs[0].password, (err, response) => {
                    if (err) {
                        res.status(401).json({
                            message: "Auth Failed"
                        });
                    }
                    if (response) {
                        res.status(200).json({
                            message: "Auth Successful"
                        });
                    } else {
                        res.status(401).json({
                            message: "Auth Failed"
                        });
                    }
                })
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });


});
router.post("/:userID/:sampleID", (req, res, next) => {
    Samples.findById(req.params.sampleID).exec()
        .then(doc => {
            Users.findByIdAndUpdate(req.params.userID, { $inc: { score: doc.score }, $push : { "completed": req.params.sampleID } }, { new: true }).exec()
                .then(docs => {
                    res.status(201).json({
                        message: "Score Updated"
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

});

router.get("/", (req, res, next) => {
    Users.find().select("_id email score completed").exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        score: doc.score,
                        completed: doc.completed,
                        request: {
                            type: "GET",
                            description: "Get information about induvidual user",
                            url: "https://parkisnons.onrender.com/users" + doc._id
                        }
                    }
                })
            });
        });
});

router.get("/:userID", (req, res, next) => {
    Users.findById(req.params.userID).select("_id email score completed").exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: "GET",
                        url: "https://parkisnons.onrender.com/users"
                    }
                });
            } else {
                res.status(404).json({
                    message: "No User found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch("/:userID", (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Users.findByIdAndUpdate(req.params.userID, updateOps).exec()
        .then(doc => {
            res.status(200).json({
                message: "User Details Updated"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:userID", (req, res, next) => {
    Users.findByIdAndDelete(req.params.userID).exec()
        .then(doc => {
            res.status(200).json({
                message: "User Deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});
module.exports = router;