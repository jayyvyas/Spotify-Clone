const mongoose = require("mongoose");

//Creating Song Model
const songSchema = new mongoose.Schema({
	title: { type: String, required: true },
	duration: Number,
	audioUrl: String,
	artist: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	albums: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Album",
		default: null,
	},
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
