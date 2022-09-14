const router = require('express').Router(),
      Floor = require('../../models/Floor'),
      auth = require('./../auth');

router.use(auth.verifyToken);

// admin
router.post('/add', auth.isAdmin ,(req, res) => {
    const {floor ,limit} = req.body;
    const addFloor = new Floor();
    addFloor.floor = floor;
    addFloor.limit = limit;
    for(let i=1; i<=limit; i++) {
        addFloor.spots.push({spot:i})
    }
    addFloor.save()
    .then((data) => {
        if(!data) {
            res.send('Try again')
        }
        res.send({message : "Success", data : data});
    })
    .catch(err => {
        res.send({error : {message : err.message}});
    })
});

// admin
router.delete('/delete', auth.isAdmin ,(req, res) => {
    const {floor} = req.body ;
    if(floor && typeof(floor)==="number" && floor>0) {
        Floor.deleteOne({floor})
        .then((data) => {
            if(!data) {
                res.send("Please try again")
            }else if(data.deletedCount===0) {
                res.send({error : {message : "Floor doesn't exist"}})
            }
            res.send({message : "Floor deleted successfully"})
        })
        .catch(err => {
            res.send(err.message);
        })
    }else {
        res.send({error : {
            message : "Please provide floor number"
        }})
    }
});

// admin
router.get('/', auth.isAdmin ,(req, res) => {
    const floor = req.body.floor;
    if(floor && typeof(floor)==="number") {
        Floor.findOne({floor}).select('spots floor limit')
        .then(data => {
            if(!data) {
                res.send({error : {message : "Floor doesn't exist"}});
            }
            res.send(data)
        })
        .catch(err => {
            res.send(err.message);
        })
    }else {
        res.send({error : {message : "Please provide floor number to get spots"}});
    }
});

module.exports = router;