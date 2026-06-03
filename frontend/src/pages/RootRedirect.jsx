import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

export default function RootRedirect() {
	const navigate = useNavigate();

	useEffect(() => {
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
	}, []);

	return (
		<div className="min-h-screen bg-black text-white flex items-center justify-center text-sm text-zinc-400">
			Loading...
		</div>
	);
}
