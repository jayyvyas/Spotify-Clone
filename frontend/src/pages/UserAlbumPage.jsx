import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import api from "../config/api";

export default function UserAlbumPage() {
	const [albums, setAlbums] = useState([]);
	const [user, setUser] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const [userRes, albumsRes] = await Promise.all([api.get("/api/auth/me"), api.get("/api/albums/me")]);

				setUser(userRes.data.user);
				setAlbums(albumsRes.data.albums || []);
			} catch (err) {
				console.log(err.response?.data?.message);
			}
		}

		fetchData();
	}, []);

	return (
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-16 select-none">
			{/* Ambient Background Glow Layer for Cohesive App Theme */}
			<div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-green-500/10 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10">
				<Navbar user={user} />

				{/* CONDITION 1: PREMIUM EMPTY STATE SYSTEM */}
				{albums.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center px-6">
						{/* Glowing music badge icon */}
						<div className="w-20 h-20 rounded-full bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl text-green-400">
							<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
								/>
							</svg>
						</div>

						<h2 className="text-2xl font-extrabold tracking-tight text-white">No albums created yet</h2>
						<p className="text-zinc-400 mt-2 max-w-sm text-sm font-medium leading-relaxed">
							Initialize your very first digital album profile and start composing your modern public
							music library.
						</p>

						<Link
							to="/upload-album"
							className="mt-6 px-6 py-3 rounded-full bg-green-500 text-black text-xs font-extrabold tracking-wide uppercase hover:bg-green-400 active:scale-[0.97] transition-all duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.4)]"
						>
							Create First Album
						</Link>
					</div>
				) : (
					/* CONDITION 2: DYNAMIC ALBUMS INFRASTRUCTURE GRID */
					<div className="max-w-6xl mx-auto px-6 sm:px-10">
						{/* TEXT TITLE BANNER */}
						<div className="pt-12 pb-6 border-b border-zinc-900">
							<span className="text-[10px] uppercase font-extrabold tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
								Artist Catalog
							</span>
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mt-3 text-white">
								My Albums
							</h1>
							<p className="text-zinc-400 mt-1 text-sm font-medium">
								Manage, customize, and view all your premium release tracks in one secure layout.
							</p>
						</div>

						{/* COMPACT ALBUMS RESPONSIVE CARD PATRIX */}
						<div className="py-10">
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
								{albums.map((album) => (
									<Link
										key={album._id}
										to={`/albums/${album._id}`}
										className="group flex flex-col bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
									>
										{/* Album Art Frame Container */}
										<div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-md border border-zinc-900/60">
											<img
												src={album.albumCover?.url}
												alt={album.title}
												className="w-full h-full object-cover group-hover:scale-104 transition duration-500"
												loading="lazy"
											/>
											{/* Immersive gradient mask shading over active image elements */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

											{/* Micro-interactive custom play trigger circle widget overlay */}
											<div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-green-500 text-black flex items-center justify-center shadow-xl translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
												<svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
										</div>

										{/* Card Content Information labels */}
										<div className="mt-4 min-w-0">
											<h3 className="text-sm font-bold text-zinc-200 group-hover:text-green-400 truncate transition-colors duration-200">
												{album.title}
											</h3>
											<p className="text-[11px] font-semibold text-zinc-500 mt-0.5 uppercase tracking-wider">
												Studio Master
											</p>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
