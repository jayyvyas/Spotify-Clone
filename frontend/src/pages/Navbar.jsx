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
		<div className="sticky top-0 z-50 bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-900/80 shadow-lg">
			{/* Main Center Content Wrapper */}
			<div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
				{/* LEFT SIDE: Identity & Core Navigation */}
				<div className="flex items-center gap-8 min-w-0">
					<Link to="/" className="hover:opacity-90 transition active:scale-95 flex-shrink-0">
						<h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white truncate max-w-[160px] sm:max-w-xs">
							{getGreeting()}, <span className="text-green-500">{user?.name?.toUpperCase()}</span>
						</h1>
					</Link>

					{/* Desktop Navigation Links */}
					{user?.role === "artist" && (
						<nav className="hidden md:flex items-center gap-1.5 self-stretch h-20">
							<NavLink
								to="/my-albums"
								className={({ isActive }) =>
									`text-xs font-bold uppercase tracking-wider relative flex items-center h-full px-2 transition-colors duration-200 group/nav ${
										isActive ? "text-green-400" : "text-zinc-400 hover:text-white"
									}`
								}
							>
								{({ isActive }) => (
									<>
										<span>My Albums</span>
										{/* Dynamic underline bar for active state visualization */}
										<div
											className={`absolute bottom-0 left-0 right-0 h-[3px] bg-green-500 rounded-t-full transition-transform duration-200 ${
												isActive ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-50"
											}`}
										/>
									</>
								)}
							</NavLink>
						</nav>
					)}
				</div>

				{/* RIGHT SIDE: Interactive Actions & Account Management */}
				<div className="flex items-center gap-4 flex-shrink-0">
					{user?.role === "artist" && (
						<Link
							to="/upload-album"
							className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-400 text-black text-xs font-black tracking-wide uppercase active:scale-95 transition shadow-md shadow-green-500/10"
						>
							<span className="sm:hidden">Create</span>
							<span className="hidden sm:inline">Create Album</span>
						</Link>
					)}

					{/* ACCOUNT DROPDOWN INTERFACE COMPOSER */}
					<div className="relative group flex items-center gap-3 py-2 cursor-pointer">
						{/* Status Label Stack */}
						<div className="hidden md:block text-right leading-none">
							<p className="text-xs font-bold text-zinc-100 group-hover:text-green-400 transition-colors duration-200">
								{user?.name}
							</p>
							<p className="text-[9px] uppercase font-black tracking-widest text-zinc-500 mt-1">
								{user?.role === "user" ? "Listener" : "Artist"}
							</p>
						</div>

						{/* Profile Image Trigger container */}
						<div className="relative flex-shrink-0 group-hover:scale-102 transition duration-200">
							<img
								src={user?.profileImage?.url || fallback}
								alt="Avatar"
								onError={(e) => (e.currentTarget.src = fallback)}
								className="w-10 h-10 rounded-full object-cover border border-zinc-800 group-hover:border-green-500 transition-colors duration-300"
							/>
							<div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-950 rounded-full shadow-md" />
						</div>

						{/* DROP-DOWN WINDOW ELEMENT */}
						<div className="absolute right-0 top-[110%] w-52 bg-zinc-900/95 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] overflow-hidden z-50">
							{/* Profile Header Status metadata */}
							<div className="px-4 py-3.5 bg-zinc-950/40 border-b border-zinc-800/60">
								<p className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-500">
									Signed in as
								</p>
								<p className="text-xs font-bold text-zinc-200 truncate mt-1">
									{user?.email || user?.name}
								</p>
							</div>

							{/* Dropdown Action list buttons */}
							<div className="p-1.5 space-y-0.5">
								<Link
									to="/profile"
									className="flex w-full items-center px-3 py-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800/60 transition"
								>
									View Profile
								</Link>

								{user?.role === "artist" && (
									<Link
										to="/my-albums"
										className="flex md:hidden w-full items-center px-3 py-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800/60 transition"
									>
										My Albums
									</Link>
								)}

								<button
									onClick={handleLogout}
									className="w-full flex items-center px-3 py-2.5 text-xs font-bold text-red-400/80 hover:text-red-400 rounded-xl hover:bg-red-500/5 transition mt-1"
								>
									Log out
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
