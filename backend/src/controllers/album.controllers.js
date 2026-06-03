const Album = require("../models/album.model");
const Song = require("../models/song.model");

const uploadFile = require("../services/imageUpload.service");

//GET /api/albums
async function fetchAlbums(req, res) {
	try {
		const albums = await Album.find().populate("artist", "name");

		return res.status(200).json({
			message: "Successfully Fetched Albums",
			albums,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching albums",
			error: error.message,
		});
	}
}

//POST /api/albums
async function createAlbum(req, res) {
	const { title } = req.body || {};
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	if (!title || !req.file) {
		return res.status(400).json({
			message: "Album title and albumCover is required",
		});
	}

	try {
		const result = await uploadFile(req.file, "albumcovers");

		if (!result?.url) {
			return res.status(500).json({
				message: "Image upload failed",
			});
		}

		const album = await Album.create({
			title,
			artist: userId,
			albumCover: { url: result.url, fileId: result.fileId },
		});

		return res.status(201).json({
			message: "Album Created",
			albumId: album._id,
		});
	} catch (err) {
		return res.status(500).json({
			message: "Server error",
		});
	}
}

//GET /api/albums/:id

async function fetchAlbumDetails(req, res) {
	try {
		const { id: albumId } = req.params;

		const album = await Album.findById(albumId).populate("artist", "name");

		if (!album) {
			return res.status(404).json({
				message: "Album not found",
				success: false,
			});
		}

		const songs = await Song.find({ album: album._id }).populate("artist", "name");

		return res.status(200).json({
			message: "Album Successfully Fetched",
			success: true,
			album,
			songs,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error Fetching Album",
			success: false,
			error: error.message,
		});
	}
}

//GET /api/albums/:id/songs

async function fetchAlbumSongs(req, res) {
	const id = req.params?.id;

	let album = await Album.findById(id);
	if (!album) {
		return res.json({ message: "No album found" });
	}

	let songs = await Song.find({ albums: id });
	if (songs.length === 0) return res.json({ message: "No Songs in this Album." });

	return res.json({ message: "Songs Successfully Fetched.", songs });

	res.json({ message: "Album Songs Fetched." });
}

//POST /api/albums/:id/songs
async function uploadAlbumSong(req, res) {
	let albumId = req.params?.id;
	const title = req.body?.title;
	const songFile = req?.file;

	//checking if albumid is valid
	const album = await Album.findById(albumId);
	if (!album) {
		return res.json({ message: "No album found" });
	}
	albumId = album._id;

	//checking songfile and title are valid
	if (!songFile && !title) {
		return res.json({ message: "songFile and title is needed" });
	}
	//uploading song to imagekit

	let uploadResult;

	try {
		uploadResult = await uploadFile(songFile, "songs");

		if (!uploadResult?.url) {
			return res.status(500).json({
				message: "Invalid upload response",
			});
		}
	} catch (err) {
		return res.status(502).json({
			message: "Failed to upload file to storage service",
		});
	}

	//creating song

	const createdSong = await Song.create({
		title,
		audioUrl: uploadResult.url,
		duration: uploadResult.duration,
		artist: req.user.id,
		albums: albumId,
	});

	res.json({ message: "Song Successsfully Created", createdSong });
}

async function SendUserAlbums(req, res) {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ message: "User Not Found" });
		}

		const albums = await Album.find({ artist: userId });

		return res.json({
			message: "User Albums Fetched",
			albums,
		});
	} catch (err) {
		return res.status(500).json({
			message: "Error Fetching Albums",
			error: err.message,
		});
	}
}

module.exports = {
	fetchAlbums,
	createAlbum,
	fetchAlbumDetails,
	fetchAlbumSongs,
	uploadAlbumSong,
	SendUserAlbums,
};
