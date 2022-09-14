const jwt = require('jsonwebtoken'),
    secret = require('../config/env/index').secret;

const verifyToken = function(req, res, next) {
    const {authorization} = req.headers;
    if(authorization && authorization.split(" ")[0]==="Token" || 
    authorization && authorization.split(" ")[0]==="Bearer"){
        const token = authorization.split(' ')[1];
        try {
                jwt.verify(token, secret, (error, data) => {
                if(error) {
                    res.send('Please login first');
                }else {
                    req.user = data;
                    next();
                }
            })
        }catch {
            res.send({error : {message : `Token expired.Login again`}});
        }
    }
};

const isAdmin = function(req, res, next) {
    if(req.user.role===1) {
        next()
    }else{
        res.send({error : {message : "Only admin has this permission."}})
    }
}

const isStaff = function(req, res, next) {
    if(req.user.role===2) {
        next()
    }else {
        res.send({error : {message : "Only staff has this permission."}})
    }
}

const isAdmin_Staff = function(req, res, next) {
    if(req.user.role===2 || req.user.role===1) {
        next()
    }else {
        res.send({error : {message : "Only admin and staff have this permission."}})
    }
}

const auth = {
    verifyToken,
    isAdmin,
    isStaff,
    isAdmin_Staff
}

module.exports = auth;