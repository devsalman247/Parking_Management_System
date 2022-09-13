const mongoose = require('mongoose');

const VehicleSchema= new mongoose.Schema({
    "model" : {
        type     : String,
        required : true,
        unique   : true
    },
    "owner" : {
        type     : mongoose.Schema.Types.ObjectId,
        ref      : 'User',
        required : true
    },
    "isBooked" : {
        type    : Boolean,
        default : false
    },
    "floor" : {
        type : Number
    },
    "spot" : {
        type : Number
    },
    "booked_At" : Date,
    "endBooking" : Date,
    "bill" : {              // $20/hour
        type : String,  
        default : "$0"
    },
    "fine" : {              // $10/ 15 mins
        type : String,
        default : "$0"
    }
},{timestamps : true});

VehicleSchema.methods.toJSON = function() {
    const date = new Date(this.booked_At).toUTCString();
    return {
        owner : this.owner,
        model : this.model,
        isBooked : this.isBooked,
        floor : this.floor,
        spot : this.spot,
        bookedAt : date==="Invalid Date" ? this.booked_At : date 
    }
}

module.exports = mongoose.model('Vehicle', VehicleSchema);