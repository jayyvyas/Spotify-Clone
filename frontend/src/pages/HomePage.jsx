import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import api from "../config/api";

export default function HomePage() {
	const [albums, setAlbums] = useState([]);
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const [albumsRes, songsRes] = await Promise.all([api.get("/api/albums"), api.get("/api/songs")]);

				setAlbums(albumsRes.data.albums || []);
				setSongs(songsRes.data.songs || []);
			} catch (err) {
				console.log(err.response?.data?.message);
				setError(err.response?.data?.message || "Something went wrong.");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">Loading...</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center text-red-500 text-2xl">{error}</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />

			{/* HERO STRIP */}
			<div className="border-b border-green-500/10 bg-gradient-to-r from-black via-green-950/20 to-black">
				<div className="max-w-6xl mx-auto px-6 py-12">
					<h1 className="text-4xl md:text-5xl font-black">Discover Music</h1>
					<p className="text-zinc-400 mt-2">Trending albums and songs across the platform</p>
				</div>
			</div>

			{/* CONTENT */}
			<div className="max-w-6xl mx-auto px-6 py-10 space-y-14">
				{/* ALBUMS */}
				<div>
					<h2 className="text-sm uppercase tracking-wider text-green-400 mb-6">Trending Albums</h2>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
						{albums.map((album) => (
							<Link key={album._id} to={`/albums/${album._id}`} className="group">
								{/* CARD */}
								<div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group-hover:border-green-500/40 transition">
									<img
										src={
											typeof album.albumCover === "string"
												? album.albumCover
												: album.albumCover?.url
										}
										className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
									/>

									{/* DARK OVERLAY */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
								</div>

								{/* TEXT */}
								<p className="mt-3 text-sm font-medium truncate group-hover:text-green-400 transition">
									{album.title}
								</p>

								<p className="text-xs text-zinc-500 truncate">{album.artist?.name}</p>
							</Link>
						))}
					</div>
				</div>

				{/* SONGS */}
				<div>
					<h2 className="text-sm uppercase tracking-wider text-green-400 mb-6">Trending Songs</h2>

					<div className="space-y-3">
						{songs.map((song) => (
							<div
								key={song._id}
								className="flex items-center justify-between px-4 py-4 rounded-lg border border-white/5 hover:border-green-500/30 bg-black/40 hover:bg-black/60 transition group"
							>
								{/* LEFT */}
								<div>
									<p className="text-sm font-medium group-hover:text-green-400">{song.title}</p>
									<p className="text-xs text-zinc-500">{song.artist?.name}</p>
								</div>

								{/* RIGHT */}
								<Link to={`/songs/${song._id}/player?albumId=${song.albums}`}>
									<button className="px-4 py-1 text-xs rounded-full bg-green-500 text-black hover:bg-green-400 transition">
										Play
									</button>
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
