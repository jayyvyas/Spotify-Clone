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
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-16 select-none">
			{/* Ambient Background Glow matching the system theme */}
			<div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-green-500/10 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10">
				<Navbar />

				{/* HERO BLOCK */}
				<div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-900/30 via-zinc-950/20 to-zinc-950 backdrop-blur-md">
					<div className="max-w-5xl mx-auto px-6 pt-12 pb-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
						{/* ALBUM IMAGE CANVAS */}
						<div className="w-44 h-44 sm:w-52 sm:h-52 flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-zinc-800/80 bg-zinc-900">
							{album?.albumCover ? (
								<img
									src={
										typeof album.albumCover === "string" ? album.albumCover : album.albumCover?.url
									}
									alt={album?.title}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
									<svg className="w-10 h-10 stroke-current" fill="none" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
										/>
									</svg>
								</div>
							)}
						</div>

						{/* ALBUM INFO */}
						<div className="min-w-0 flex-1">
							<span className="inline-block uppercase text-[10px] font-extrabold tracking-[0.3em] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full mb-3">
								Studio Session
							</span>
							<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white truncate">
								{album?.title || "Loading Album..."}
							</h1>
							<div className="flex items-center justify-center sm:justify-start gap-2 mt-4 text-xs font-semibold tracking-wide text-green-400">
								<span className="bg-green-500/5 px-2.5 py-1 rounded-md border border-green-500/10">
									Add new track
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* CENTRALIZED UPLOAD FORM CONTAINER */}
				<div className="max-w-2xl mx-auto px-6 py-12">
					<div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-900 p-6 sm:p-8 rounded-3xl shadow-2xl">
						<h2 className="text-lg font-bold text-zinc-100 mb-6">Upload New Song</h2>

						{error && (
							<div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/5 border border-red-500/10 px-4 py-3 rounded-xl mb-5">
								<svg
									className="w-4 h-4 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<p className="font-medium">{error}</p>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-5">
							{/* TRACK TITLE INPUT */}
							<div className="space-y-2">
								<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-1">
									Song Title
								</label>
								<input
									type="text"
									placeholder="Enter song name"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full bg-zinc-950/60 text-white px-4 py-3 rounded-xl border border-zinc-800/80 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-zinc-600 font-medium"
								/>
							</div>

							{/* AUDIO NATIVE PICKER UTILITY */}
							<div className="space-y-2">
								<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-1 block">
									Audio File
								</label>
								<input
									type="file"
									accept="audio/*"
									onChange={(e) => setAudioFile(e.target.files[0])}
									className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-black file:font-bold hover:file:bg-green-400 file:cursor-pointer transition bg-zinc-950/40 border border-zinc-800/80 p-2 rounded-xl"
								/>
							</div>

							{/* SUBMIT BUTTON */}
							<button
								type="submit"
								disabled={loading}
								className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition shadow-[0_4px_20px_rgba(34,197,94,0.2)] mt-2"
							>
								{loading ? (
									<span className="flex items-center justify-center gap-2 text-sm tracking-wide">
										<svg
											className="animate-spin h-4 w-4 text-black"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Uploading Master...
									</span>
								) : (
									"Upload Song"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
