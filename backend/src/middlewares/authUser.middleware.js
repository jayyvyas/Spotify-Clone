const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authUser(req, res, next) {
	const { token } = req.cookies || {};

	if (!token) {
		return res.status(401).json({
			message: "Unauthorized Access",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				message: "User not found",
			});
		}

		req.user = user; // 👈 full DB user
		next();
	} catch (err) {
		return res.status(401).json({
			message: "Invalid Token",
		});
	}
}

module.exports = authUser;
