const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require('./api/routes/Users');
const predictRoutes = require('./api/routes/Predict');

const app = express();
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// handling CORS
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Accept, Authorization, Content-Type");
    if(req.method === 'OPTIONS'){
        res.header(
            "Access-Control-Allow-Methods", 
            "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


mongoose.connect("mongodb+srv://sanjaynithin2002:" +process.env.MONGODB_PASSWORD +  "@cluster0.kgz6ota.mongodb.net/?retryWrites=true&w=majority");

app.use('/users', userRoutes);
app.use('/predict', predictRoutes);

app.use((req,res,next)=>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;