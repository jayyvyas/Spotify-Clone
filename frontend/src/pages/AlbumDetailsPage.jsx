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

	if (loading) {
		return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
	}
	if (error) {
		return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />
			{/* HERO */}
			<div className=" via-black to-black border-b border-white/5">
				<div className="max-w-6xl mx-auto px-6 pt-16 pb-10 flex flex-col md:flex-row items-center md:items-end gap-8">
					<img
						src={album.albumCover?.url}
						alt={album.title}
						className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-lg shadow-2xl border border-white/10"
					/>

					<div className="text-center md:text-left">
						<p className="uppercase text-xs tracking-[0.3em] text-green-400 mb-3">Album</p>

						<h1 className="text-5xl md:text-7xl font-black leading-none text-white">{album.title}</h1>

						<div className="flex items-center justify-center md:justify-start gap-2 mt-5 text-sm text-zinc-400">
							<span className="font-medium text-white">
								Created By {album.artist?.name || "Unknown Artist"}
							</span>

							<span className="text-zinc-600">•</span>

							<span className="text-green-400">{songs.length} songs</span>
						</div>
						{isOwner ? (
							<div className="upload-button mt-6">
								<Link to={`/albums/${album._id}/upload`}>
									<button className="bg-green-500 hover:bg-green-400 hover:text-black  text-white  px-6 py-3 rounded-full transition duration-200 shadow-lg shadow-green-500/20">
										+ Upload Song
									</button>
								</Link>
							</div>
						) : null}
					</div>
				</div>
			</div>

			{/* SONGS */}
			<div className="max-w-5xl mx-auto px-6 py-8">
				{songs.length === 0 ? (
					<p className="text-white text-md">No songs in this album yet.</p>
				) : (
					<div className="space-y-2">
						{songs.map((song, index) => (
							<div
								key={song._id}
								className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/5 gap-3"
							>
								{/* LEFT */}
								<div className="flex items-center gap-5 min-w-0">
									<span className="text-green-500 text-sm w-4">{index + 1}</span>

									<div className="min-w-0">
										<p className="text-white font-medium truncate">{song.title}</p>
										<p className="text-sm text-zinc-500 mt-1">{album.artist?.name}</p>
									</div>
								</div>

								{/* RIGHT */}
								<div className="flex flex-col sm:flex-row items-center gap-3 sm:ml-auto w-full sm:w-auto">
									{/* ACTIONS (before audio) */}
									<div className="flex items-center gap-3">
										<Link to={`/songs/${song?._id}/player?albumId=${album?._id}`}>
											<button className="flex items-center gap-2 px-5 py-3 rounded-full bg-green-500 hover:bg-green-400 text-black font-medium transition">
												<Play size={18} fill="currentColor" />
												<span>Play</span>
											</button>
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
