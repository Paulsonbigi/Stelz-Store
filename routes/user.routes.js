const express = require("express");
const router = express.Router();
const { authorize } = require("../middleware/authorize")

const { getCurrentUser, getAllUsers } = require("../controllers/user.controllers");

// get routes
router.get("/me", authorize, getCurrentUser);
router.get("/get_all_users", authorize, getAllUsers);


module.exports = router;
