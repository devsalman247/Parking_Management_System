const router = require('express').Router(),
    {verifyToken,isAdmin,isStaff, isAdmin_Staff} = require('../auth'),
    User = require("../../models/User"),
    Floor = require("../../models/Floor"),
    Vehicle = require('../../models/Vehicle');

router.use(verifyToken);

// user, admin , staff
router.get('/', (req, res) => {
    const {owner} = req.body;
    if(owner) {
        Vehicle.find({owner}).populate("owner", "id email")
        .then(data => {
            if(!data) {
                res.send({error : {message : "User not found"}})
            }
            res.send(data);
        })
        .catch(e => {
            res.send({error : {message : e.message}})
        })
    }else {
        res.send({error : {message : "Please provide owner id"}})
    }
});

// staff
router.post('/add', isStaff,(req, res) => {
    const {model, owner} = req.body;
    if(owner && typeof(owner)==="string" && model && typeof(model)==="string") {
        User.findById(owner)
        .then(data => {
            if(!data) {
                res.send({error : {message : "User doesn't exist"}})
            }
            const addVehicle = new Vehicle();
                addVehicle._id = data._id;
                addVehicle.owner = owner;
                addVehicle.model = model;
            addVehicle.save()
            .then(data => {
                if(!data) {
                    res.send("Please try again");
                }
                res.send({success : true, message : "Vehicle added successfully"});
            })
            .catch(err => {
                res.send({error : {message : err.message}});
            })
        })
        .catch(err => {
            res.send({error : {message : err.message}});
        })
    }else {
        res.send({error : {message : "Please provide id of user and model of vehicle"}})
    }
});

// staff
router.delete('/delete', isStaff,(req, res) => {
    const {model} = req.body;
    Vehicle.findOneAndDelete({model})
    .then(data => {
        if(!data) {
            res.send({error : {message : "Vehicle is not present"}});
        }
        res.send({success : "true", message : "Vehicle deleted successfully"})
    })
    .catch(e => {
        res.send({error : {message : e.message}})
    })
});

// admin
router.get('/all',isAdmin_Staff,(req, res) => {
    Vehicle.find().populate("owner", "id email")
    .then(data => {
        if(!data) {
            res.send({error : {message : "No vehicle added yet"}})
        }
        res.send({message : "success", data });
    }) 
    .catch(e => {
        res.send({error : {message: e.message}})
    })
});

module.exports = router;