const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Halaman Login
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

// Halaman Registrasi
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

// Logout
router.get("/logout", authController.logout);

module.exports = router;
