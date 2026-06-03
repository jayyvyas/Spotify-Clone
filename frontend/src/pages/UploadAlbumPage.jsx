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
		<div className="min-h-screen bg-black text-white">
			<Navbar />

			{/* PAGE LAYOUT */}
			<div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
				{/* LEFT: FORM */}
				<div>
					<h1 className="text-4xl font-black ">Create Album</h1>
					<p className="text-zinc-500 mt-2">Give your music a name and identity</p>

					<form onSubmit={handleSubmit} className="mt-10 space-y-6">
						{/* TITLE */}
						<div>
							<label className="text-md text-zinc-400">Album Title</label>
							<input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="e.g. Midnight Vibes"
								className="w-full mt-2 px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl outline-none focus:border-green-500"
							/>
						</div>

						{/* COVER */}
						<div>
							<label className="text-md text-zinc-400 pr-2">Album Cover</label>
							<input
								type="file"
								accept="image/*"
								onChange={(e) => setAlbumCover(e.target.files[0])}
								className="mt-2 text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-500 file:text-black hover:file:bg-green-400"
							/>
						</div>

						{/* ERROR */}
						{error && <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md">{error}</p>}

						{/* BUTTON */}
						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 rounded-xl bg-green-500 text-black  hover:bg-green-400 transition"
						>
							{loading ? "Creating..." : "Create Album"}
						</button>
					</form>
				</div>

				{/* RIGHT: PREVIEW PANEL */}
				<div className="flex flex-col justify-center">
					<div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-950">
						{/* cover preview */}
						<div className="aspect-square bg-zinc-900 flex items-center justify-center">
							{preview ? (
								<img src={preview} className="w-full h-full object-cover" />
							) : (
								<p className="text-zinc-500 text-sm">Album cover preview</p>
							)}
						</div>

						{/* info */}
						<div className="p-5">
							<p className="text-sm text-zinc-500">Preview</p>
							<h2 className="text-xl  mt-1">{title || "Untitled Album"}</h2>
							<p className="text-sm py-1">by {title ? user?.name : "Unknown"}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
