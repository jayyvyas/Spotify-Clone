const express = require("express");
const {
	fetchAlbums,
	createAlbum,
	fetchAlbumDetails,
	fetchAlbumSongs,
	SendUserAlbums,
	uploadAlbumSong,
} = require("../controllers/album.controllers");
const authUser = require("../middlewares/authUser.middleware");
const allowArtist = require("../middlewares/allowArtist.middleware");
const upload = require("../config/multer.config");
const { deleteSong } = require("../controllers/songControllers");
const router = express.Router();

//api: /api/albums
router.get("/", fetchAlbums);
router.get("/me", authUser, allowArtist, SendUserAlbums);
router.get("/:id", fetchAlbumDetails);
router.get("/:id/songs", fetchAlbumSongs);
router.post("/:id/songs", upload.single("song"), authUser, uploadAlbumSong);

router.post("/", upload.single("albumCover"), authUser, allowArtist, createAlbum);

//delete a song, //DELETE /api/albums/:id/songs/:songid
router.delete("/:id/songs/:songId", authUser, allowArtist, deleteSong);

module.exports = router;
