const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

const FloorSchema = new mongoose.Schema({
    "floor" : {
        type     : Number,
        unique   : true,
        required : true
    },
    "limit" : {
        type     : Number,
        required : true
    },
    "spots" : [{
        "spot" : {
            type    : Number,
        },
        "isBooked" : {
            type    : Boolean,
            default : false
        },
        "booked_By" : {
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'User' 
        }
    }]
},{timestamps : true});

FloorSchema.plugin(uniqueValidator, "is already taken.");

FloorSchema.methods.toJSON = function() {
    return {
        floor : this.floor,
        limit : this.limit,
        spots : this.spots
    }
}

module.exports = mongoose.model('Floor', FloorSchema);