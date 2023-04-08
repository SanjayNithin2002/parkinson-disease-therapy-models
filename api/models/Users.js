const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id : mongoose.SchemaTypes.ObjectId,
    password : {
        type : String, 
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    score : {
        type: Number,
        default : 0
    }
});


module.exports = mongoose.model("UsersParkinsons", userSchema);