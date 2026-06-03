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
		<div className="min-h-screen bg-black text-white">
			<Navbar user={user} />

			{/* EMPTY STATE */}
			{albums.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-[75vh] text-center px-6">
					<div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
						<span className="text-green-400 text-2xl">♪</span>
					</div>

					<p className="text-2xl font-semibold text-white">No albums yet</p>

					<p className="text-zinc-500 mt-2 max-w-md">
						Create your first album and start building your music library
					</p>

					<Link
						to="/upload-album"
						className="mt-6 px-5 py-2 rounded-full bg-green-500 text-black text-sm font-medium hover:bg-green-400 transition"
					>
						Create Album
					</Link>
				</div>
			) : (
				<>
					{/* HEADER */}
					<div className="px-10 pt-12">
						<h1 className="text-4xl md:text-5xl font-black  tracking-tight">My Albums</h1>

						<p className="text-zinc-500 mt-2">All your creations in one place</p>
					</div>

					{/* GRID */}
					<div className="px-10 py-10">
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7">
							{albums.map((album) => (
								<Link key={album._id} to={`/albums/${album._id}`} className="group">
									{/* CARD */}
									<div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/20">
										<img
											src={album.albumCover?.url}
											className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
										/>

										{/* subtle overlay */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition" />
									</div>

									{/* TITLE */}
									<p className="mt-3 text-sm font-medium text-center truncate group-hover:text-green-400 transition">
										{album.title}
									</p>
								</Link>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
