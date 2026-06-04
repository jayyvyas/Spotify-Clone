const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");

//importing routers
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");
const albumRoutes = require("../src/routes/album.routes");

//importing middlewares
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Connect to the database
connectDB();
app.set("trust proxy", 1);

const allowedOrigins = [
	"http://localhost:5173", // Keep this so you can still test on your computer
	"https://spotify-clone-theta-flame.vercel.app", // Your live Vercel frontend URL
];

//global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));
app.use(cookieParser());
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);

module.exports = app;
