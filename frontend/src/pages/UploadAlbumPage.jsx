import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { UserContext } from "../contexts/UserContext";
import api from "../config/api";

export default function UploadAlbumPage() {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	const [title, setTitle] = useState("");
	const [albumCover, setAlbumCover] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const preview = albumCover ? URL.createObjectURL(albumCover) : null;

	useEffect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview);
		};
	}, [preview]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!title || !albumCover) {
			setError("Title and cover image are required.");
			return;
		}

		try {
			setLoading(true);

			const formData = new FormData();
			formData.append("title", title);
			formData.append("albumCover", albumCover);

			const res = await api.post("/api/albums", formData);

			const albumId = res.data?.albumId;
			if (!albumId) throw new Error("Album ID not found");

			navigate(`/albums/${albumId}`);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create album");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-16">
			{/* Subtle background ambient colors to match other pages */}
			<div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[500px] rounded-full bg-green-500/10 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10">
				<Navbar />

				{/* SIMPLIFIED GRID LAYOUT */}
				<div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
					{/* LEFT PANEL: SIMPLE FORM SETUP */}
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight text-white">Create Album</h1>
						<p className="text-zinc-400 mt-1 text-sm">Give your music a name and identity</p>

						<form onSubmit={handleSubmit} className="mt-8 space-y-5">
							{/* ALBUM TITLE FIELD */}
							<div className="space-y-2">
								<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
									Album Title
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="e.g. Midnight Vibes"
									className="w-full bg-zinc-900 text-white px-4 py-3 rounded-xl border border-zinc-800 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-zinc-600"
								/>
							</div>

							{/* NATIVE FILE SELECTOR */}
							<div className="space-y-2">
								<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">
									Album Cover
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => setAlbumCover(e.target.files[0])}
									className="mt-2 text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-black file:font-bold hover:file:bg-green-400 file:cursor-pointer transition"
								/>
							</div>

							{/* ERROR MANAGEMENT CONTAINER */}
							{error && (
								<p className="text-red-400 text-sm bg-red-500/5 border border-red-500/10 px-4 py-3 rounded-xl font-medium">
									{error}
								</p>
							)}

							{/* FORM SUBMIT INTERACTION BUTTON */}
							<button
								type="submit"
								disabled={loading}
								className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition shadow-[0_4px_20px_rgba(34,197,94,0.2)]"
							>
								{loading ? "Creating..." : "Create Album"}
							</button>
						</form>
					</div>

					{/* RIGHT PANEL: MINIMAL ART PREVIEW */}
					<div className="flex flex-col justify-center">
						<div className="border border-zinc-900 bg-zinc-900/20 backdrop-blur-md rounded-2xl overflow-hidden p-4">
							{/* Live Square Image Box */}
							<div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center text-zinc-600">
								{preview ? (
									<img src={preview} alt="Album Art Preview" className="w-full h-full object-cover" />
								) : (
									<p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
										Album Cover Preview
									</p>
								)}
							</div>

							{/* Live Information Text Block */}
							<div className="pt-4 px-1">
								<span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
									Preview
								</span>
								<h2 className="text-lg font-bold text-white truncate mt-0.5">
									{title || "Untitled Album"}
								</h2>
								<p className="text-xs text-zinc-400 mt-0.5">
									by <span className="font-semibold">{title ? user?.name : "Unknown"}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
