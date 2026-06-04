const mongoose = require("mongoose");
const Song = require("../models/song.model");
const Album = require("../models/album.model");
const uploadFile = require("../services/imageUpload.service");

//GET /api/songs
async function fetchSongs(req, res) {
	const songs = await Song.find({}).limit(5).populate("artist", "name");

	if (songs.length === 0) return res.json({ message: "No Songs Found" });

	res.status(200).json({
		message: "Songs fetched",
		songs,
	});
} 

//DELETE /api/albums/:id/songs/:songid
async function deleteSong(req, res) {
	const { id: albumId, songId } = req.params;

	try {
		const album = await Album.findById(albumId);
		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		// ownership check
		if (!album.artist || String(album.artist) !== req.user.id) {
			return res.status(403).json({ message: "Not allowed" });
		}

		const song = await Song.findById(songId);
		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}

		// ensure song belongs to this album
		if (!song.albums || String(song.albums) !== albumId) {
			return res.status(403).json({ message: "Invalid song for this album" });
		}

		await Song.findByIdAndDelete(songId);

		return res.status(200).json({
			message: "Song deleted successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error.message || "Something went wrong",
		});
	}
}

//PATCH /api/songs/:songId/edit

async function editSong(req, res) {
	const { albumId } = req.query;
	const { songId } = req.params;
	const { title } = req.body;
	const songFile = req.file;

	if (!songId || !albumId) {
		return res.status(400).json({
			message: "albumId and songId is required.",
		});
	}

	if (!title && !songFile) {
		return res.status(400).json({
			message: "At least one field is required to update.",
		});
	}

	try {
		const album = await Album.findById(albumId);
		if (!album) {
			return res.status(404).json({ message: "Album cannot be found." });
		}

		const song = await Song.findById(songId);
		if (!song) {
			return res.status(404).json({ message: "Song cannot be found." });
		}

		if (String(song.albums) !== String(album._id)) {
			return res.status(403).json({
				message: "Song does not belong to this album.",
			});
		}

		if (title) {
			song.title = title;
		}

		if (songFile) {
			try {
				const result = await uploadFile(songFile);

				if (!result?.url) {
					return res.status(500).json({
						message: "Song upload failed",
					});
				}

				song.audioUrl = result.url;
			} catch (err) {
				return res.status(500).json({
					message: "Upload error",
				});
			}
		}

		await song.save();

		return res.status(200).json({
			message: "Song Updated",
			song,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message || "Something went wrong.",
		});
	}
}

async function getSongDetails(req, res) {
	let { songId } = req.params;
	let { albumId } = req.query;

	albumId = albumId?.trim();
	songId = songId?.trim();

	//checking if query format is a string
	if (!mongoose.Types.ObjectId.isValid(songId)) {
		return res.status(400).json({ message: "Invalid song id" });
	}
	if (!mongoose.Types.ObjectId.isValid(albumId)) {
		return res.status(400).json({ message: "Invalid album id" });
	}

	try {
		const song = await Song.findById(songId).populate("artist");
		if (!song) {
			return res.status(404).json({ message: "Cannot find Song.", song });
		}
		const album = await Album.findById(albumId);

		if (!album) {
			return res.status(404).json({ message: "Cannot find Album." });
		}
		return res.status(200).json({ message: "Song fetched successfully.", song, album });
	} catch (error) {
		return res.status(500).json({ message: error?.message || "Something went Wrong." });
	}
}

module.exports = { fetchSongs, deleteSong, editSong, getSongDetails };
