const User = require("../model/user.model");
const jwt = require('jsonwebtoken');

exports.authorize = async (req, res, next) => {
    try{
        let token;
        if(req.headers.Authorization && req.headers.Authorization.startsWith("Bearer")){
            token = req.headers.Authorization.split(" ")[1];
        } else if(req.cookies.token) {
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({ success: false, msg: "You are not authorized. Login in to perform this operation"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const currentUser = await User.findById(decoded.id).select("+password")
        if(!currentUser){
            return res.status(401).json({ success: false, msg: "You are not authorized. Login in to perform this operation"})
        }
        req.user = currentUser
        next()
        
    } catch(err){

    }
}