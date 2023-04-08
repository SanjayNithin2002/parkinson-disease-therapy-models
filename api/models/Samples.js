const mongoose = require('mongoose');

const sampleSchema = mongoose.Schema({
    _id : mongoose.SchemaTypes.ObjectId,
    url : {
        type : String
    },
    score : {
        type : Number
    },
    value : {
        type: String
    }
});

module.exports = mongoose.model("Samples", sampleSchema);