const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const authUser = require("../middlewares/authUser.middleware");

//file upload middleware
const upload = require("../config/multer.config");

router.post("/register", upload.single("image"), authControllers.registerUser);

router.get("/users", authControllers.SendAllUsers);

router.post("/login", authControllers.loginUser);

router.get("/me", authUser, authControllers.fetchUserData);

router.patch("/me", authUser, upload.single("profileImage"), authControllers.updateUser);

router.post("/logout", authControllers.logoutUser);

router.delete("/me", authUser, authControllers.deleteUser);

router.post("/password", authUser, authControllers.ResetPassword);

module.exports = router;
