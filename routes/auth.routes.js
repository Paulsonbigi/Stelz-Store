const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logout, forgotPassword, resetPasword } = require("../controllers/auth.controllers");

// post routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);

// patch routes
router.post("/reset-password/:token", resetPasword);

module.exports = router;
