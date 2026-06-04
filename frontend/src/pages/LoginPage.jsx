import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import api from "../config/api";

export default function LoginPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { setUser } = useContext(UserContext);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	function handleChange(e) {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await api.post("/api/auth/login", formData);

			setUser(res.data.user);
			navigate("/home");
		} catch (error) {
			setError(error.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		/* Outer Viewport Container with Premium Green Mesh Background */
		<div className="relative min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 overflow-hidden select-none">
			{/* Background Ambient Gradient Blobs (Gives that deep Spotify premium glow) */}
			<div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-green-500/15 blur-[130px] pointer-events-none" />

			{/* Main Glassmorphic Card Container */}
			<div className="relative w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] z-10">
				{/* Header Section */}
				<div className="text-center mb-8">
					{/* Minimalist Spotify Icon Style Accent */}
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
						<svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
							<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.075-.336.135-.668.47-.743 3.856-.88 7.15-.51 9.822 1.13.296.178.387.563.206.858zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.867-2.155-10.074-1.18-.413.125-.848-.107-.973-.52-.125-.413.107-.847.52-.973 3.666-1.114 8.233-.574 11.343 1.34.367.226.487.706.26 1.073zm.106-2.833C14.384 8.71 8.56 8.52 5.174 9.547c-.528.16-1.083-.142-1.243-.67-.16-.527.142-1.083.67-1.243 3.883-1.178 10.32-.962 14.39 1.454.475.282.63.896.347 1.37-.282.475-.896.63-1.37.348z" />
						</svg>
					</div>
					<h1 className="text-white text-3xl font-extrabold tracking-tight">Welcome Back</h1>
					<p className="text-zinc-400 mt-2 text-sm font-medium">Log in to your Spotify account</p>
				</div>

				{/* Form Elements */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase ml-1">
							Email Address
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="name@example.com"
							className="w-full bg-zinc-950/60 text-white px-4 py-3.5 rounded-2xl border border-zinc-800/80 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 placeholder:text-zinc-600 font-medium"
						/>
					</div>

					<div className="space-y-2">
						<div className="flex justify-between items-center ml-1">
							<label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">
								Password
							</label>
						</div>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="••••••••"
							className="w-full bg-zinc-950/60 text-white px-4 py-3.5 rounded-2xl border border-zinc-800/80 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 placeholder:text-zinc-600 font-medium"
						/>
					</div>

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

					<button
						type="submit"
						disabled={loading}
						className="relative w-full overflow-hidden bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.4)]"
					>
						<span className="flex items-center justify-center gap-2 tracking-wide text-sm">
							{loading ? (
								<>
									<svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
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
									Securing your groove...
								</>
							) : (
								"Sign In To Account"
							)}
						</span>
					</button>
				</form>

				{/* Footer Link section */}
				<div className="text-center mt-8 pt-4 border-t border-zinc-800/40">
					<p className="text-zinc-500 text-xs font-medium">
						New to Spotify?{" "}
						<Link
							to="/register"
							className="text-green-400 hover:text-green-300 hover:underline ml-1 font-semibold transition"
						>
							Create free account
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
