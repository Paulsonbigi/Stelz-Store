const User = require("../model/user.model");


// @Route GET request
// @desc request to get authenticated user details
//  @access private access
exports.getCurrentUser = async (req, res, next) => {
    try{

        res.status(200).json({
            user: req.user
        })

    } catch(err){
        console.log(err)
    }
}

// @Route GET request
// @desc request to get authenticated user details restricted to admin only
// @access private access
exports.getAllUsers = async (req, res, next) => {
    try{
      const user = await User.find()
        if(!user) return next(new AppError("No registered user yet", 400))
  
        await res.status(200).json({
          success: true, 
          data: user
        })
  
    } catch(err){
      next(new AppError(err.message, 404))
    }
  }