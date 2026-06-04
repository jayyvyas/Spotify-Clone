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

	// Premium Skeleton Loading Screen
	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
				<Navbar />
				<div className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 space-y-12 animate-pulse">
					<div className="h-28 bg-zinc-900/50 rounded-3xl border border-zinc-800/40" />
					<div className="space-y-4">
						<div className="h-4 w-32 bg-zinc-900 rounded" />
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="aspect-square bg-zinc-900 rounded-2xl" />
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Modern Elegant Error Screen
	if (error) {
		return (
			<div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
				<div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
					<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h2 className="text-xl font-bold text-white mb-1">Failed to load Dashboard</h2>
				<p className="text-zinc-400 text-sm max-w-xs">{error}</p>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-16">
			{/* Ambient Background Glows mirroring auth page style */}
			<div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-green-500/10 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[20%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10">
				<Navbar />

				{/* HERO BANNER */}
				<div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
					<div className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
						<div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-transparent pointer-events-none" />
						<div>
							<span className="text-xs font-bold tracking-widest text-green-400 uppercase bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
								Dashboard
							</span>
							<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-3 text-white">
								Discover Music
							</h1>
							<p className="text-zinc-400 mt-2 text-sm md:text-base font-medium">
								Explore handpicked trending albums and high-fidelity audios across our entire ecosystem.
							</p>
						</div>
					</div>
				</div>

				{/* CONTENT MAIN COMPOSER */}
				<div className="max-w-6xl mx-auto px-6 py-8 space-y-16">
					{/* SECTION: ALBUMS */}
					<div>
						<div className="flex justify-between items-end mb-6">
							<div>
								<h2 className="text-lg font-bold tracking-tight text-white">Trending Albums</h2>
								<p className="text-xs text-zinc-400 font-medium mt-0.5">
									The most played records this week
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
							{albums.map((album) => (
								<Link
									key={album._id}
									to={`/albums/${album._id}`}
									className="group flex flex-col bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
								>
									{/* Cover wrapper */}
									<div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
										<img
											src={
												typeof album.albumCover === "string"
													? album.albumCover
													: album.albumCover?.url
											}
											alt={album.title}
											className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
											loading="lazy"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

										{/* Play Hover Float Indicator */}
										<div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
											<svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
												<path d="M8 5v14l11-7z" />
											</svg>
										</div>
									</div>

									{/* Details */}
									<div className="mt-4 min-w-0">
										<h3 className="text-sm font-bold truncate text-zinc-100 group-hover:text-green-400 transition-colors duration-200">
											{album.title}
										</h3>
										<p className="text-xs font-medium text-zinc-500 truncate mt-1">
											{album.artist?.name || "Unknown Artist"}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>

					{/* SECTION: SONGS */}
					<div>
						<div className="mb-6">
							<h2 className="text-lg font-bold tracking-tight text-white">Trending Songs</h2>
							<p className="text-xs text-zinc-400 font-medium mt-0.5">Instant stream premium audios</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{songs.map((song) => (
								<div
									key={song._id}
									className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-900 hover:border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/60 transition-all duration-300 group shadow-sm"
								>
									<div className="flex items-center gap-4 min-w-0">
										{/* Minimal decorative music icon token */}
										<div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-green-400 group-hover:border-green-500/20 transition-all duration-300">
											<svg
												className="w-5 h-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
												/>
											</svg>
										</div>
										<div className="min-w-0">
											<h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-green-400 transition-colors duration-200">
												{song.title}
											</h3>
											<p className="text-xs font-medium text-zinc-500 truncate mt-0.5">
												{song.artist?.name || "Unknown Artist"}
											</p>
										</div>
									</div>

									<Link
										to={`/songs/${song._id}/player?albumId=${song.albums}`}
										className="flex-shrink-0 ml-4"
									>
										<button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-zinc-900 hover:bg-green-500 text-zinc-300 hover:text-black border border-zinc-800 hover:border-transparent active:scale-95 transition-all duration-200 shadow-md">
											<svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
												<path d="M8 5v14l11-7z" />
											</svg>
											Play
										</button>
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
