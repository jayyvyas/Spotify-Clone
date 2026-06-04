import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

export default function RootRedirect() {
	const navigate = useNavigate();

	useEffect(() => {
		if (!navigate) return;

		async function checkAuth() {
			try {
				await api.get("/api/auth/me");

				// logged in
				navigate("/home");
			} catch (err) {
				// not logged in (401)
				console.log(err.message);
				navigate("/login");
			}
		}

		checkAuth();
	}, [navigate]);

	return (
		/* Immersive dark background layout to eliminate white flashes on route bootstrap */
		<div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center select-none">
			{/* Core Equalizer Loading Animation for structural continuity */}
			<div className="flex items-end gap-1.5 h-12">
				<div className="w-1 h-8 bg-green-500 rounded-full animate-bounce duration-500" />
				<div className="w-1 h-12 bg-green-500 rounded-full animate-bounce duration-300" />
				<div className="w-1 h-6 bg-green-500 rounded-full animate-bounce duration-700" />
				<div className="w-1 h-14 bg-green-500 rounded-full animate-bounce duration-400" />
				<div className="w-1 h-8 bg-green-500 rounded-full animate-bounce duration-600" />
			</div>

			<p className="mt-5 text-zinc-500 text-[11px] font-black uppercase tracking-widest animate-pulse">
				Establishing Session...
			</p>
		</div>
	);
}
