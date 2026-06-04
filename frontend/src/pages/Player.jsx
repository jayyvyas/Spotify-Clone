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
		if (isNaN(seconds) || seconds === Infinity) return "0:00";
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
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-16 select-none">
			{/* Dynamic Ambient Background Glows matching the application theme */}
			<div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-green-500/10 blur-[140px] pointer-events-none animate-pulse duration-[4000ms]" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10 flex flex-col min-h-screen">
				<Navbar />

				{/* CONDITION 1: PREMIUM CUSTOM LOADING STATE SKELETON */}
				{loading ? (
					<div className="flex-1 flex items-center justify-center min-h-[70vh]">
						<div className="flex flex-col items-center">
							<div className="flex items-end gap-1.5 h-16">
								<div className="w-1.5 h-10 bg-green-500 rounded-full animate-bounce duration-500" />
								<div className="w-1.5 h-14 bg-green-500 rounded-full animate-bounce duration-300" />
								<div className="w-1.5 h-8 bg-green-500 rounded-full animate-bounce duration-700" />
								<div className="w-1.5 h-16 bg-green-500 rounded-full animate-bounce duration-400" />
								<div className="w-1.5 h-10 bg-green-500 rounded-full animate-bounce duration-600" />
							</div>
							<p className="mt-6 text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">
								Syncing Audio Pipeline...
							</p>
						</div>
					</div>
				) : (
					/* CONDITION 2: MAIN IMMERSIVE PLAYER CANVAS */
					<div className="audio-container flex-1 flex items-center">
						<audio
							ref={audioRef}
							src={song?.audioUrl}
							onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
							onLoadedMetadata={() => setDuration(audioRef.current.duration)}
							loop
							onEnded={() => setIsPlaying(false)}
						/>

						<div className="max-w-5xl w-full mx-auto px-6 py-8 md:py-12">
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
								{/* LEFT BOX PANEL: ALBUM ART LAYOUT FRAME (Spans 5 Columns) */}
								<div className="lg:col-span-5 flex justify-center">
									<div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-zinc-800/80 group">
										<img
											src={album?.albumCover?.url}
											alt="Album artwork"
											className="w-full h-full object-cover transition-transform duration-[8000ms] group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
									</div>
								</div>

								{/* RIGHT BOX PANEL: MAIN MEDIA INTERACTION HUB (Spans 7 Columns) */}
								<div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
									<span className="inline-block self-center lg:self-start uppercase text-[10px] font-black tracking-[0.3em] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full mb-4 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
										Now Playing
									</span>

									<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight truncate">
										{song?.title}
									</h1>

									<p className="text-zinc-400 text-base sm:text-lg font-medium mt-1 truncate">
										{album?.title}
									</p>

									{/* ARTIST ADMINISTRATIVE CONSOLE ACTION PANEL */}
									<div className="flex items-center justify-center lg:justify-start gap-2.5 mt-6 h-10">
										{user?._id === song?.artist?._id && (
											<div className="flex items-center gap-2.5">
												<Link to={`/songs/${songId}/edit?albumId=${albumId}`}>
													<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-300 hover:text-green-400 hover:border-green-500/30 active:scale-[0.97] transition-all duration-200">
														<Pencil size={14} />
														<span className="text-xs font-bold tracking-wide">
															Edit Song
														</span>
													</button>
												</Link>

												<button
													onClick={() => setShowDeleteModal(true)}
													className="flex items-center justify-center p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-500 hover:text-red-400 hover:border-red-500/30 active:scale-[0.97] transition-all duration-200"
												>
													<Trash2 size={16} />
												</button>
											</div>
										)}
									</div>

									{/* TIMELINE AUDIO TRACK TIMING SEEKBAR FRAME */}
									<div className="mt-10">
										<div className="relative w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden shadow-inner cursor-pointer group/slider">
											<div
												className="h-full bg-green-500 rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
												style={{ width: `${progress}%` }}
											/>
										</div>

										<div className="flex justify-between mt-3 text-xs font-bold text-zinc-500 tracking-wider">
											<p className="tabular-nums">{formatTime(currentTime)}</p>
											<p className="tabular-nums">-{formatTime(remainingTime)}</p>
										</div>
									</div>

									{/* PLAYBACK CONTROL BUTTON UTILITY HUB */}
									<div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
										{/* Skip Backward Button */}
										<button
											onClick={skipBackward}
											className="flex items-center justify-center w-11 h-11 rounded-full bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition-all duration-200"
											title="Rewind 10s"
										>
											<SkipBack size={18} fill="currentColor" />
										</button>

										{/* Master Toggle Audio Trigger Button */}
										<button
											onClick={togglePlay}
											className="w-14 h-14 rounded-full bg-green-500 text-black flex items-center justify-center active:scale-[0.95] hover:scale-102 transition-all duration-300 shadow-[0_4px_25px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.4)]"
											title={isPlaying ? "Pause" : "Play"}
										>
											{isPlaying ? (
												<Pause size={22} fill="currentColor" />
											) : (
												<Play size={22} fill="currentColor" className="ml-0.5" />
											)}
										</button>

										{/* Skip Forward Button */}
										<button
											onClick={skipForward}
											className="flex items-center justify-center w-11 h-11 rounded-full bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition-all duration-200"
											title="Fast Forward 10s"
										>
											<SkipForward size={18} fill="currentColor" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* UPGRADED CONTEXTUAL DELETION DIALOG MODAL PANEL */}
			{showDeleteModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
					<div className="w-full max-w-sm rounded-3xl border border-zinc-800/80 bg-zinc-900 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] animate-fade-in">
						<div className="flex items-center gap-3 text-red-400">
							<div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
							<h2 className="text-md font-extrabold tracking-tight">Delete Song?</h2>
						</div>

						<p className="text-xs text-zinc-400 font-medium mt-3 leading-relaxed">
							Are you sure you want to drop <span className="text-white font-bold">{song?.title}</span>{" "}
							from this streaming directory? This administrative action is permanent and cannot be undone.
						</p>

						<div className="flex justify-end gap-2.5 mt-6">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all duration-200"
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
								className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide bg-red-500 hover:bg-red-400 text-black shadow-md transition-all duration-200"
							>
								Delete Song
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
