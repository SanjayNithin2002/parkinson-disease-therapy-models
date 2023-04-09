const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: Number,
        default: 0
    },
    completed: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'Samples',
        default : []
    }
});


module.exports = mongoose.model("Users", userSchema);