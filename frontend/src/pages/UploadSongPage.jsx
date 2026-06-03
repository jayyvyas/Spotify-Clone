import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import api from "../config/api";

export default function UploadSongPage() {
	const { id: albumId } = useParams();
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [audioFile, setAudioFile] = useState(null);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [album, setAlbum] = useState(null);

	useEffect(() => {
		const fetchAlbum = async () => {
			try {
				const res = await api.get(`/api/albums/${albumId}`);
				setAlbum(res.data?.album);
			} catch (err) {
				console.log(err);
			}
		};

		if (albumId) fetchAlbum();
	}, [albumId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!title || !audioFile) {
			setError("Title and audio file are required");
			return;
		}

		try {
			setLoading(true);

			const formData = new FormData();
			formData.append("title", title);
			formData.append("song", audioFile);

			const res = await api.post(`/api/albums/${albumId}/songs`, formData);

			if (!res.data?.createdSong?._id) throw new Error("Invalid response");

			navigate(`/albums/${albumId}`);
		} catch (err) {
			setError(err.response?.data?.message || "Upload failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />
			{/* HERO */}
			<div className="via-black to-black border-b border-white/5">
				<div className="max-w-6xl mx-auto px-6 pt-16 pb-10 flex flex-col md:flex-row items-center md:items-end gap-8">
					{/* ALBUM IMAGE */}
					<div className="w-52 h-52 md:w-64 md:h-64">
						{album?.albumCover ? (
							<img
								src={typeof album.albumCover === "string" ? album.albumCover : album.albumCover?.url}
								alt={album?.title}
								className="w-full h-full object-cover rounded-lg shadow-2xl border border-white/10"
							/>
						) : (
							<div className="w-full h-full rounded-lg bg-zinc-900 border border-white/10" />
						)}
					</div>

					{/* ALBUM INFO */}
					<div className="text-center md:text-left">
						<p className="uppercase text-s tracking-[0.3em] text-green-400 mb-3">Upload</p>

						<h1 className="text-5xl md:text-6xl font-black leading-none">{album?.title || "Loading..."}</h1>

						<div className="flex items-center justify-center md:justify-start gap-2 mt-5 text-sm text-zinc-400">
							<span className=" text-green-400 text-l">Add new track</span>
						</div>
					</div>
				</div>
			</div>

			{/* FORM */}
			<div className="max-w-3xl mx-auto px-6 py-10">
				<div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg">
					<h2 className="text-xl mb-6">Upload New Song</h2>

					{error && <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm">{error}</div>}

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* TITLE */}
						<div>
							<p className="text-sm text-zinc-400 mb-2">Song Title</p>
							<input
								type="text"
								placeholder="Enter song name"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full p-3 rounded-md bg-black border border-white/10 outline-none focus:border-green-500"
							/>
						</div>

						{/* FILE */}
						<div>
							<p className="text-sm text-zinc-400 mb-2">Audio File</p>
							<input
								type="file"
								accept="audio/*"
								onChange={(e) => setAudioFile(e.target.files[0])}
								className="w-full text-sm bg-black border border-white/10 p-3 rounded-md"
							/>
						</div>

						{/* BUTTON */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-green-500 hover:bg-green-400 text-black p-3 rounded-full transition shadow-lg shadow-green-500/20"
						>
							{loading ? "Uploading..." : "Upload Song"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
