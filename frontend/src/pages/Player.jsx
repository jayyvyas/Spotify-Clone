import axios from "axios";
import Navbar from "./Navbar";
import { Play, Pause, SkipBack, SkipForward, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import api from "../config/api";

export default function SongPlayerPage() {
	const navigate = useNavigate();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { user } = useContext(UserContext);
	const { songId } = useParams();
	const [searchParams] = useSearchParams();
	const albumId = searchParams.get("albumId");
	const [isPlaying, setIsPlaying] = useState(false);
	const [song, setSong] = useState(null);
	const [album, setAlbum] = useState(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [duration, setDuration] = useState(0);
	const progress = (currentTime / duration) * 100;
	const audioRef = useRef(null);
	const remainingTime = duration - currentTime;

	async function togglePlay() {
		if (!audioRef.current) return;

		try {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				await audioRef.current.play();
			}

			setIsPlaying((prev) => !prev);
		} catch (err) {
			console.error(err);
		}
	}

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);

		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}

	function skipForward() {
		if (!audioRef.current) return;

		audioRef.current.currentTime += 10;
	}

	function skipBackward() {
		if (!audioRef.current) return;

		audioRef.current.currentTime -= 10;
	}

	useEffect(() => {
		async function fetchSong() {
			try {
				const res = await api.get(`/api/songs/${songId}?albumId=${albumId}`, {
					withCredentials: true,
				});
				const songRes = res.data?.song;
				const albumRes = res.data?.album;
				setSong(songRes);
				setAlbum(albumRes);
			} catch (error) {
				setError(error?.response?.data?.message || "something went wrong");
			} finally {
				setLoading(false);
			}
		}
		fetchSong();
	}, [songId, albumId]);

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />
			{loading ? (
				<div className="flex items-center justify-center min-h-[70vh]">
					<div className="flex flex-col items-center">
						<div className="flex gap-2">
							<div className="w-2 h-10 bg-green-500 rounded-full animate-pulse"></div>
							<div
								className="w-2 h-14 bg-green-500 rounded-full animate-pulse"
								style={{ animationDelay: "0.15s" }}
							></div>
							<div
								className="w-2 h-8 bg-green-500 rounded-full animate-pulse"
								style={{ animationDelay: "0.3s" }}
							></div>
							<div
								className="w-2 h-16 bg-green-500 rounded-full animate-pulse"
								style={{ animationDelay: "0.45s" }}
							></div>
							<div
								className="w-2 h-10 bg-green-500 rounded-full animate-pulse"
								style={{ animationDelay: "0.6s" }}
							></div>
						</div>

						<p className="mt-6 text-zinc-400 tracking-wide">Loading your music...</p>
					</div>
				</div>
			) : (
				<div className="audio-container">
					<audio
						ref={audioRef}
						src={song?.audioUrl}
						onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
						onLoadedMetadata={() => {
							setDuration(audioRef.current.duration);
						}}
						loop
						onEnded={() => setIsPlaying(false)}
					/>

					<div className="max-w-6xl mx-auto px-6 py-12">
						<div className="grid lg:grid-cols-2 gap-14 items-center">
							{/* ALBUM COVER */}
							<div className="flex justify-center">
								<img
									src={album?.albumCover?.url}
									alt="album cover"
									className="w-full max-w-lg aspect-square object-cover rounded-3xl border border-white/10 shadow-2xl"
								/>
							</div>

							{/* PLAYER */}
							<div className="flex flex-col">
								<p className="text-green-400 uppercase tracking-[0.3em] text-xs">Now Playing</p>

								<h1 className="text-5xl lg:text-6xl font-black mt-3">{song?.title}</h1>

								<p className="text-zinc-400 text-xl mt-2">{album?.title}</p>

								<div className="flex items-center gap-3 mt-5">
									{user?._id === song?.artist?._id && (
										<div className="flex items-center gap-3">
											<Link to={`/songs/${songId}/edit?albumId=${albumId}`}>
												<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-green-500 hover:text-green-400 transition">
													<Pencil size={16} />
													<span className="text-sm font-medium">Edit Song</span>
												</button>
											</Link>

											<button
												onClick={() => setShowDeleteModal(true)}
												className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-500 transition"
											>
												<Trash2 size={18} />
											</button>
										</div>
									)}
								</div>
								{/* PROGRESS BAR */}
								<div className="mt-12">
									<div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
										<div
											className="h-full bg-green-500 rounded-full transition-all"
											style={{ width: `${progress}%` }}
										/>
									</div>

									<div className="flex justify-between mt-2 text-sm text-zinc-500">
										<p>{formatTime(currentTime)}</p>
										<p>{formatTime(remainingTime)}</p>
									</div>
								</div>

								{/* CONTROLS */}
								<div className="flex items-center gap-6 mt-10">
									<button
										onClick={skipBackward}
										className="flex items-center gap-2 px-4 py-3 rounded-full border border-white/10 hover:border-green-500 hover:text-green-400 transition"
									>
										<SkipBack size={20} />
										<span className="text-sm">10s</span>
									</button>

									<button
										onClick={togglePlay}
										className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center transition"
									>
										{isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
									</button>

									<button
										onClick={skipForward}
										className="flex items-center gap-2 px-4 py-3 rounded-full border border-white/10 hover:border-green-500 hover:text-green-400 transition"
									>
										<span className="text-sm">10s</span>
										<SkipForward size={20} />
									</button>
								</div>
							</div>
						</div>
					</div>
					{showDeleteModal && (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
							<div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
								<h2 className="text-xl  text-white">Delete Song?</h2>

								<p className="text-sm text-zinc-400 mt-2">
									Are you sure you want to delete{" "}
									<span className="text-white font-medium">{song?.title}</span>? This action cannot be
									undone.
								</p>

								<div className="flex justify-end gap-3 mt-6">
									<button
										onClick={() => {
											setShowDeleteModal(false);
										}}
										className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:bg-white/10 transition"
									>
										Cancel
									</button>

									<button
										onClick={async () => {
											try {
												await api.delete(
													`${import.meta.env.VITE_API_URL}/api/albums/${album._id}/songs/${song._id}`,
													{ withCredentials: true },
												);
												navigate(`/albums/${albumId}`);

												setShowDeleteModal(false);
											} catch (err) {
												console.log(err.response?.data?.message);
											}
										}}
										className="px-4 py-2 rounded-full bg-red-500 text-black hover:bg-red-400 transition"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
