const { findById } = require("../models/song.model");
const User = require("../models/user.model");
const allowArtist = async (req, res, next) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		return res.status(401).json({ message: "Not authenticated" });
	}

	if (user.role !== "artist") {
		return res.status(403).json({ message: "Access denied" });
	}

	next();
};

module.exports = allowArtist;
