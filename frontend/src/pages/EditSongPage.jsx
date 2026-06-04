import { useEffect, useState } from "react";
import axios from "axios";
import api from "../config/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

export default function EditSongPage() {
	const [title, setTitle] = useState("");
	const [audioFile, setAudioFile] = useState();

	const [song, setSong] = useState(null);
	const [album, setAlbum] = useState(null); // ✔ FIX ADDED\
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const location = useLocation();
	const albumId = new URLSearchParams(location.search).get("albumId");
	const { id } = useParams();

	useEffect(() => {
		if (!id || !albumId) return; // 👈 IMPORTANT GUARD

		const fetchSong = async () => {
			try {
				const res = await api.get(`/api/songs/${id}?albumId=${albumId}`);

				const songRes = res.data.song;

				setSong(songRes);
				setAlbum(res?.data?.album);
				setTitle(songRes?.title || "");
			} catch (err) {
				setError("Failed to load song");
				console.log(err.response?.data || err.message);
			} finally {
				setFetching(false);
				setLoading(false);
			}
		};

		fetchSong();
	}, [id, albumId]);

	async function handleSubmit(e) {
		e.preventDefault();
		const formdata = new FormData();
		formdata.append("title", title);
		formdata.append("song", audioFile);
		console.log("Form Submitted");
		setLoading(true);
		try {
			const res = await axios.patch(
				`${import.meta.env.VITE_API_URL}/api/songs/${id}/edit?albumId=${album._id}`,
				formdata,
				{
					withCredentials: true,
				},
			);
			setMessage(res.data?.message);
			setTimeout(() => {
				setMessage("");
			}, 3000);
			console.log(res.data);
			setLoading(false);
			navigate(`/albums/${albumId}`);
		} catch (error) {
			setError(error?.response?.data?.message || "something went wrong");
		}
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />

			{/* HEADER */}
			<div className="border-b border-white/5">
				<div className="max-w-5xl mx-auto px-6 pt-16 pb-14 flex flex-col items-center text-center">
					{/* Title */}
					<h1 className="text-4xl font-black text-green-400">Edit Song</h1>

					<p className="text-zinc-400 mt-2">Update your track details</p>

					{/* ALBUM INFO (CENTERED BIG STYLE) */}
					{album && (
						<div className="mt-10 flex flex-col items-center gap-5">
							<img
								src={album.albumCover?.url}
								alt="album cover"
								className="w-64 h-64 md:w-72 md:h-72 rounded-2xl object-cover shadow-2xl border border-white/10"
							/>

							<div className="text-center">
								<p className="text-xs tracking-[0.3em] text-green-400 uppercase">Album</p>

								<p className="text-3xl md:text-4xl font-bold text-white mt-2">{album.title}</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* FORM */}
			<div className="max-w-3xl mx-auto px-6 py-10">
				<div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 shadow-lg">
					{fetching ? (
						<p className="text-zinc-400">Loading song...</p>
					) : (
						<form className="space-y-6">
							{/* TITLE */}
							<div>
								<label className="text-sm text-zinc-400 mb-2 block">Song Title</label>
								<input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Enter song title"
									className="w-full p-3 rounded-lg bg-black border border-white/10 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
								/>
							</div>

							{/* FILE */}
							<div>
								<label className="text-sm text-zinc-400 mb-2 block">Replace Audio (optional)</label>

								<div className="border border-white/10 rounded-lg p-4 bg-black hover:border-green-500 transition">
									<input
										type="file"
										accept="audio/*"
										onChange={(e) => setAudioFile(e.target.files[0])}
										className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-500 file:text-black hover:file:bg-green-400"
									/>
								</div>
							</div>

							{/* ERROR */}
							{error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded-md">{error}</p>}
							{/* Message */}
							{message && (
								<p className="text-green-400 text-sm bg-green-500/10 p-2 rounded-md">{message}</p>
							)}
							{/* BUTTON */}
							<button
								type="submit"
								disabled={loading}
								onClick={(e) => {
									handleSubmit(e);
								}}
								className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black  p-3 rounded-full transition"
							>
								{loading ? "Updating..." : "Update Song"}
							</button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
