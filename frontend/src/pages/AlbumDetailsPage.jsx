import { useEffect, useState } from "react";
import api from "../config/api";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { Play } from "lucide-react";

export default function AlbumPage() {
	const [album, setAlbum] = useState(null);
	const [songs, setSongs] = useState([]);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const { id } = useParams();
	const isOwner = user?._id === album?.artist?._id;

	useEffect(() => {
		const fetchAlbumDetails = async () => {
			try {
				const albumRes = await api.get(`/api/albums/${id}`);
				const songsRes = await api.get(`/api/albums/${id}/songs`);
				const userRes = await api.get(`/api/auth/me`);

				setAlbum(albumRes.data.album);
				setSongs(songsRes.data.songs || []);
				setUser(userRes.data.user);
			} catch (err) {
				console.log(err.response?.data?.message);
				setError(err.response?.data?.message || "Something went wrong.");
			} finally {
				setLoading(false);
			}
		};

		fetchAlbumDetails();
	}, [id]);

	// Clean loading state with smooth animations
	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 flex flex-col justify-between">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<div className="flex flex-col items-center gap-3">
						<svg className="animate-spin h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24">
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
						<p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest animate-pulse">
							Fetching Tracklist...
						</p>
					</div>
				</div>
			</div>
		);
	}

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
				<h2 className="text-xl font-bold text-white mb-1">Failed to load Album</h2>
				<p className="text-zinc-400 text-sm max-w-xs">{error}</p>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-20">
			{/* Ambient Background Glows matching dashboard style */}
			<div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-green-500/10 blur-[120px] pointer-events-none" />
			<div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

			<div className="relative z-10">
				<Navbar />

				{/* HERO BLOCK */}
				<div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-900/40 via-zinc-950/20 to-zinc-950 backdrop-blur-md">
					<div className="max-w-6xl mx-auto px-6 pt-12 pb-10 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
						{/* Immersive Album Art Wrapper */}
						<div className="relative group flex-shrink-0 w-52 h-52 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-zinc-800/80">
							<img
								src={album.albumCover?.url}
								alt={album.title}
								className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
							/>
							<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300" />
						</div>

						{/* Metadata Details */}
						<div className="min-w-0 flex-1">
							<span className="inline-block uppercase text-xs font-black tracking-[0.3em] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full mb-4 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
								Album
							</span>

							<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight md:leading-none text-white truncate drop-shadow-sm">
								{album.title}
							</h1>

							<div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-6 text-sm font-medium">
								<span className="text-zinc-200">
									Created By{" "}
									<span className="text-white font-bold hover:underline cursor-pointer">
										{album.artist?.name || "Unknown Artist"}
									</span>
								</span>
								<span className="text-zinc-700">•</span>
								<span className="text-green-400 font-semibold bg-green-500/5 px-2.5 py-0.5 rounded-md border border-green-500/10">
									{songs.length} tracks
								</span>
							</div>

							{/* Conditional Artist Actions */}
							{isOwner && (
								<div className="mt-6 flex justify-center md:justify-start">
									<Link to={`/albums/${album._id}/upload`}>
										<button className="flex items-center gap-2 bg-green-500 hover:bg-green-400 active:scale-[0.97] text-black text-xs font-extrabold tracking-wide uppercase px-5 py-3 rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.4)]">
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2.5}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													stroke
													d="M12 4v16m8-8H4"
												/>
											</svg>
											Upload Song
										</button>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* TRACKLIST MATRIX */}
				<div className="max-w-5xl mx-auto px-6 py-10">
					{songs.length === 0 ? (
						<div className="text-center py-16 bg-zinc-900/10 border border-zinc-900/60 rounded-3xl backdrop-blur-sm p-8">
							<svg
								className="w-10 h-10 mx-auto text-zinc-600 mb-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
								/>
							</svg>
							<p className="text-zinc-400 text-sm font-medium">
								No tracks available inside this catalog yet.
							</p>
						</div>
					) : (
						<div className="space-y-2.5">
							{songs.map((song, index) => (
								<div
									key={song._id}
									className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/20 hover:bg-zinc-900/60 border border-zinc-900/40 hover:border-zinc-800/80 transition-all duration-300 group gap-4 shadow-sm"
								>
									{/* LEFT BLOCK: Track Index & Meta Identification */}
									<div className="flex items-center gap-4 min-w-0 flex-1">
										<span className="text-zinc-500 font-bold text-xs w-5 text-center group-hover:text-green-400 transition-colors duration-200">
											{String(index + 1).padStart(2, "0")}
										</span>

										<div className="min-w-0">
											<p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-green-400 transition-colors duration-200">
												{song.title}
											</p>
											<p className="text-xs font-medium text-zinc-500 truncate mt-0.5">
												{album.artist?.name || "Unknown Artist"}
											</p>
										</div>
									</div>

									{/* RIGHT BLOCK: Fluid Action Modals */}
									<div className="flex-shrink-0">
										<Link to={`/songs/${song?._id}/player?albumId=${album?._id}`}>
											<button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-zinc-900 hover:bg-green-500 text-zinc-300 hover:text-black border border-zinc-800 hover:border-transparent active:scale-95 transition-all duration-200 shadow-md">
												<Play size={13} fill="currentColor" className="ml-0.5" />
												<span>Play</span>
											</button>
										</Link>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
