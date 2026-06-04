import { useEffect, useState } from "react";
import axios from "axios";
import api from "../config/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

export default function EditSongPage() {
	const [title, setTitle] = useState("");
	const [audioFile, setAudioFile] = useState();

	const [song, setSong] = useState(null);
	const [album, setAlbum] = useState(null);
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const location = useLocation();
	const albumId = new URLSearchParams(location.search).get("albumId");
	const { id } = useParams();

	useEffect(() => {
		if (!id || !albumId) return;

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
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-16 select-none">
			{/* Theme Mesh Ambient Glow Effects */}
			<div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-green-500/10 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10">
				<Navbar />

				{/* HERO OVERVIEW LAYER */}
				<div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-900/40 via-zinc-950/20 to-zinc-950 backdrop-blur-md">
					<div className="max-w-5xl mx-auto px-6 pt-12 pb-10 flex flex-col items-center text-center">
						<span className="inline-block uppercase text-[10px] font-black tracking-[0.3em] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full mb-3">
							Studio Customizer
						</span>
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
							Edit Song
						</h1>
						<p className="text-zinc-400 mt-1 text-sm font-medium">
							Alter track configurations and update underlying audio masters.
						</p>

						{/* ENGAGING ALBUM COMPLEMENTARY FRAME */}
						{album && (
							<div className="mt-8 flex flex-col items-center gap-4 animate-fade-in">
								<img
									src={album.albumCover?.url}
									alt="album cover"
									className="w-56 h-56 md:w-60 md:h-60 rounded-2xl object-cover shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] border border-zinc-800/80"
								/>
								<div className="text-center">
									<p className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">
										Parent Album
									</p>
									<p className="text-xl font-bold text-zinc-200 mt-0.5">{album.title}</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* FORM LAYER BLOCK CONTAINER */}
				<div className="max-w-xl mx-auto px-6 py-12">
					<div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-900 p-6 sm:p-8 rounded-3xl shadow-2xl">
						{fetching ? (
							<div className="flex flex-col items-center justify-center py-10 gap-3">
								<svg className="animate-spin h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24">
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
								<p className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">
									Parsing track indexes...
								</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-5">
								{/* TEXT INPUT: TITLE */}
								<div className="space-y-2">
									<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-1">
										Song Title
									</label>
									<input
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Enter song title"
										className="w-full bg-zinc-950/60 text-white px-4 py-3.5 rounded-2xl border border-zinc-800/80 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-zinc-600 font-medium"
									/>
								</div>

								{/* FILE UTILITY COMPONENT: AUDIO */}
								<div className="space-y-2">
									<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-1 block">
										Replace Audio{" "}
										<span className="text-[10px] text-zinc-600 font-bold lowercase italic">
											(optional)
										</span>
									</label>
									<input
										type="file"
										accept="audio/*"
										onChange={(e) => setAudioFile(e.target.files[0])}
										className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-black file:font-bold hover:file:bg-green-400 file:cursor-pointer transition bg-zinc-950/40 border border-zinc-800/80 p-2 rounded-xl"
									/>
								</div>

								{/* RESPONSE AND VALIDATION FEEDBACK MODULES */}
								{error && (
									<div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/5 border border-red-500/10 px-4 py-3 rounded-xl animate-fade-in">
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

								{message && (
									<div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/5 border border-green-500/10 px-4 py-3 rounded-xl animate-fade-in">
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
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<p className="font-medium">{message}</p>
									</div>
								)}

								{/* ACTION UPDATE BUTTON */}
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.2)] mt-2"
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
											Overwriting Track Master...
										</span>
									) : (
										"Update Song"
									)}
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
