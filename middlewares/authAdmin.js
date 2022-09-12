module.exports = function(req, res, next) {
    const role = req.body.role;
    if(role==="admin" || role==="staff") {
        return next();
    }else {
        return res.send("Request is declined");
    }
}