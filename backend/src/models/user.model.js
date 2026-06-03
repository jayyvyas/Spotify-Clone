const mongoose = require("mongoose");

const UserSchema = {
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: { type: String, required: true },
	role: { type: String, enum: ["user", "artist"], default: "user" },
	profileImage: {
		url: { type: String, default: "/images/default-avatar.webp" },
		fileId: { type: String, default: null },
	},
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
