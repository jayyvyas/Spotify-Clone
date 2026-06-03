const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		artist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		albumCover: {
			url: {
				type: String,
				default: "/images/songsCoverPictures/default-coverpicture.png",
			},
			fileId: {
				type: String,
				default: null,
			},
		},
	},
	{ timestamps: true },
);

const Album = mongoose.model("Album", albumSchema);
module.exports = Album;
