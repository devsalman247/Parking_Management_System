const router = require('express').Router(),
      auth = require('../auth'),
      Vehicle = require('../../models/Vehicle');

router.use(auth.verifyToken);

// staff
router.get('/', auth.isStaff,(req, res, next) => {
    const {booked_At} = req.body;
    Vehicle.find({
        booked_At : {
            $lte : (new Date(booked_At)).setHours(23,59,59,999),
            $gte : new Date(booked_At)
        }, 
        isBooked : true
    })
    .then(vehicle => {
        if(!vehicle) {
            res.send({message : "No vehicle booked at provided date"})
        }
        res.send(vehicle);
    })
    .catch(e => {
        res.send({error : {message : e.message}})
    })
});

// staff
router.post('/add', auth.isStaff,(req, res, next) => {
    const {model, floor, spot, endBooking} = req.body;
    if(floor || spot || endBooking) {
        Vehicle.findOne({model})
        .then(vehicle => {
            if(!vehicle) {
                res.send({error : {message : "Vehicle is not present"}})
            }
            Vehicle.updateOne({model}, {$set : {floor,spot, isBooked : true, booked_At : Date.now(), endBooking : new Date(endBooking)}})
            .then(data => {
                if(!data) {
                    res.send({error : {message : "Vehicle can't be booked.Try again!"}})
                }
                res.send({success : true, message : "Vehicle booked successfully"})
            })
            .catch(e => {
                res.send({error : {message : e.message}})
            })
        })
        .catch(e => {
            res.send({error : {message : e.message}})
        })
    }else {
        res.send({error : {message : "Please provide model, floor, spot, booking end time to book vehicle."}})
    }
});

router.put('/remove', auth.isStaff, (req, res, next) => {
    const {model} = req.body;
    Vehicle.findOne({model})
    .then(vehicle => {
        if(!vehicle) {
            res.send({error : {message : "Vehicle is not present"}})
        }else if(vehicle.isBooked===false) {
            res.send({error : {message : "Vehicle is not booked yet"}})
        }
        const startTime = vehicle.booked_At;
        const endTime = vehicle.endBooking;
        let fine = 0;
        const fineTime = Math.floor((Date.now() - endTime)/60000);
        if(fineTime>=15) {
            fine = fineTime * 10;
        }
        const bill = ((startTime - endTime)/ 3600000).toFixed(2) * 20;
        Vehicle.updateOne({model},{$set : {isBooked : false, bill : '$'+bill, fine : '$'+fine}})
        .then(data => {
            if(!data) {
                res.send({error : {message : "Please try again"}})
            }
            res.send({success : true, message : "Booking removed successfully"})
        })
        .catch(e => {
            res.send({error : {message : e.message}})
        })
    }) 
    .catch(e => {
        res.send({error : {message : e.message}})
    })
})

// admin, staff
router.get('/all', auth.isAdmin_Staff,(req, res, next) => {
    Vehicle.find({isBooked: true})
    .then(vehicle => {
        if(!vehicle) {
            res.send({success : true, message : "No vehicle has booked yet"})
        }
        res.send(vehicle);
    })
    .catch(e => {
        res.send({error : {message : e.message}})
    })
});

module.exports = router;