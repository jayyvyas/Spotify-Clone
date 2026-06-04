import { Link, useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import api from "../config/api";

function Navbar() {
	const navigate = useNavigate();

	const { user } = useContext(UserContext);

	const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
	const fallback = `${BASE_URL}/images/default-avatar.webp`;

	function getGreeting() {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	}

	const handleLogout = async () => {
		try {
			await api.post("/api/auth/logout", {}, { withCredentials: true });
			navigate("/login");
		} catch (err) {
			console.log("Logout failed", err.response?.data?.message);
		}
	};

	return (
		<div className="sticky top-0 z-10 bg-gradient-to-r from-black via-green-950/40 to-black backdrop-blur border-b border-white/5">
			<div className="px-4 md:px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				{/* LEFT */}
				<div className="flex gap-5 items-center">
					<Link to="/">
						<h1 className="text-2xl">
							{getGreeting()}, <span className="text-green-500">{user?.name}</span>
						</h1>
					</Link>

					{user?.role === "artist" && (
						<>
							<div className="h-8 w-px bg-white/30" />
							<NavLink
								to="/my-albums"
								className={({ isActive }) =>
									isActive ? "text-green-500 text-lg pt-2" : "text-white text-lg pt-2"
								}
							>
								My Albums
							</NavLink>
						</>
					)}
				</div>

				{/* RIGHT */}
				<div className="flex items-center gap-6">
					{user?.role === "artist" && (
						<>
							<Link
								to="/upload-album"
								className="px-5 py-2 rounded-full bg-green-500 text-black   text-sm hover:bg-green-400 transition shadow-md"
							>
								Create Album
							</Link>
							<div className="h-8 w-px bg-white/30" />
						</>
					)}

					{/* USER BLOCK */}
					<div className="relative group flex items-center gap-4 py-3">
						<div className="text-right leading-tight">
							<p className="text-sm font-medium text-white">{user?.name}</p>
							<p className="text-xs text-zinc-400">{user?.role === "user" ? "User" : "Artist"}</p>
						</div>

						<Link to="/profile">
							<img
								src={user?.profileImage?.url || fallback}
								onError={(e) => (e.currentTarget.src = fallback)}
								className="w-11 h-11 rounded-full object-cover border border-white/10 hover:border-green-500 transition"
							/>
						</Link>

						{/* DROPDOWN */}
						<div className="absolute right-0 top-full w-44 bg-zinc-950 border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition shadow-xl overflow-hidden">
							<div className="px-4 py-3 border-b border-white/10">
								<p className="text-xs text-zinc-500">Signed in as</p>
								<p className="text-sm text-white truncate">{user?.email || user?.name}</p>
							</div>

							<button
								onClick={handleLogout}
								className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-red-400 transition"
							>
								Log out
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
