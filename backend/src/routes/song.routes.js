const express = require("express");
const upload = require("../config/multer.config");
const songControllers = require("../controllers/songControllers");
const authUser = require("../middlewares/authUser.middleware");
const allowArtist = require("../middlewares/allowArtist.middleware");

const router = express.Router();

router.get("/", authUser, songControllers.fetchSongs);
router.get("/:songId", songControllers.getSongDetails);
router.patch("/:songId/edit", upload.single("song"), songControllers.editSong);
module.exports = router;
