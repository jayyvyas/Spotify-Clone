const bcrypt = require("bcrypt");
const uploadFile = require("../services/imageUpload.service");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const imagekit = require("../config/imagekit.config");
const Album = require("../models/album.model");
const Song = require("../models/song.model");

//POST /api/auth/register
async function registerUser(req, res) {
	let { name, email, password, role } = req.body || {};

	name = name?.trim();
	email = email?.trim().toLowerCase();
	password = password?.trim();

	if (!name || !email || !password) {
		return res.status(400).json({
			message: "Username, email and password are required",
		});
	}

	try {
		const existingUser = await User.findOne({
			$or: [{ email }, { name }],
		});

		if (existingUser) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name: name.trim(),
			email: email.trim(),
			password: hashedPassword,
			profileImage: {
				url: "/images/default-avatar.webp",
				fileId: null,
			},
			role: role || "user",
		});

		const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		return res.status(201).json({
			message: "User registered successfully",
			user,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
}

//DELETE /api/auth/me : delete user

async function deleteUser(req, res) {
	try {
		const userId = req.user?.id;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		const fileId = typeof user.profileImage === "string" ? null : user.profileImage?.fileId;

		if (fileId) {
			try {
				await imagekit.deleteFile(fileId);
			} catch (error) {
				return res.status(500).json({
					message: "Failed to delete image from Cloud.",
				});
			}
		}

		// delete dependent data
		await Song.deleteMany({ artist: userId });
		await Album.deleteMany({ artist: userId });

		// finally delete user
		await User.findByIdAndDelete(userId);

		return res.status(200).json({
			message: "User deleted.",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message || "Something went wrong.",
		});
	}
}

//GET /api/auth/users

async function SendAllUsers(req, res) {
	let users = await User.find();
	if (users.length === 0) {
		return res.status(404).json({ message: "No Users Found." });
	}
	res.status(200).json({
		message: "All Users Fetched.",
		users,
	});
}

//POST /api/auth/login
async function loginUser(req, res) {
	let { email, password } = req.body || {};

	email = email?.trim();
	password = password?.trim();

	if (!email || !password) {
		return res.status(400).json({
			message: "Email and password are required",
		});
	}

	// finding user
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({
			message: "User does not exist",
		});
	}

	// checking password
	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return res.status(400).json({
			message: "Invalid credentials",
		});
	}

	// generating token
	const token = jwt.sign(
		{
			id: user._id,
			email: user.email,
		},
		process.env.JWT_SECRET,
	);

	// setting cookie
	res.cookie("token", token, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});

	return res.status(200).json({
		message: "Login successful",
		user,
	});
}

//GET /api/auth/me
async function fetchUserData(req, res) {
	const userId = req.user?.id;

	try {
		const user = await User.findById(userId).select("-password");

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		return res.status(200).json({
			message: "UserData Fetched",
			user,
		});
	} catch (err) {
		return res.status(500).json({
			message: "Error fetching user from Database.",
		});
	}
}

//PATCH /api/auth/me -- edit the current logged in user
async function updateUser(req, res) {
	const { id } = req.user;
	const { name, email } = req.body || {};
	const imageFile = req.file;

	const user = await User.findById(id);

	if (!user) {
		return res.status(404).json({
			message: "User not found",
		});
	}

	let oldFileId = user.profileImage?.fileId;

	// IMAGE
	let result;
	if (imageFile) {
		try {
			result = await uploadFile(imageFile, "profileimages");

			if (!result?.url) {
				return res.status(500).json({
					message: "Image upload failed",
				});
			}

			user.profileImage = {
				url: result.url,
				fileId: result.fileId,
			};
		} catch (err) {
			return res.status(500).json({
				message: "Error uploading image",
			});
		}
	}

	// NAME
	if (name !== undefined) {
		if (typeof name !== "string" || name.trim() === "") {
			return res.status(400).json({
				message: "Invalid name",
			});
		}

		user.name = name.trim();
	}

	// EMAIL

	if (email !== undefined) {
		//checking if email is a string before normalizing
		if (typeof email !== "string") {
			return res.status(400).json({
				message: "Invalid email format",
			});
		}

		//  normalizing email
		const normalizedEmail = email.trim().toLowerCase();

		// validating email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(normalizedEmail)) {
			return res.status(400).json({
				message: "Invalid email format",
			});
		}

		//checking if there is a profile with the email
		const existingUser = await User.findOne({
			email: normalizedEmail,
			_id: { $ne: id },
		});

		if (existingUser) {
			return res.status(400).json({
				message: "Email already in use",
			});
		}

		user.email = normalizedEmail;
	}

	await user.save();

	if (result?.fileId && oldFileId) {
		try {
			await imagekit.deleteFile(oldFileId);
		} catch (err) {
			console.log("Failed to delete old image:", err.message);
		}
	}

	return res.json({
		message: "User Updated",
		updatedUser: user,
	});
}

//POST /api/auth/logout
function logoutUser(req, res) {
	res.clearCookie("token", {
		httpOnly: true,
		secure: true, // Add this
		sameSite: "none", // Change "lax" to "none"
	});

	res.json({ message: "Logged out" });
}

//POST /api/auth/password
async function ResetPassword(req, res) {
	let { oldPassword, newPassword } = req.body || {};

	console.log(oldPassword, newPassword);

	currentPassword = oldPassword?.trim();
	newPassword = newPassword?.trim();

	if (!oldPassword || !newPassword) {
		return res.status(400).json({
			message: "Current password and new password are required.",
		});
	}

	const user = await User.findById(req.user.id);

	const isMatch = await bcrypt.compare(oldPassword, user.password);

	if (!isMatch) {
		return res.status(401).json({
			message: "Current password is incorrect.",
		});
	}

	user.password = await bcrypt.hash(newPassword, 10);

	await user.save();

	return res.json({
		message: "Password successfully reset.",
	});
}

module.exports = {
	registerUser,
	loginUser,
	fetchUserData,
	logoutUser,
	updateUser,
	deleteUser,
	SendAllUsers,
	ResetPassword,
};
