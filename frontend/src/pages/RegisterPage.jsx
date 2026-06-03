import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import api from "../config/api";

export default function RegisterPage() {
	const { setUser } = useContext(UserContext);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "user",
	});

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
			const res = await api.post("/api/auth/register", formData);

			setUser(res.data.user);
			navigate("/home");
		} catch (err) {
			setError(err.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-black px-4">
			<div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-white text-4xl font-bold tracking-tight">Spotify</h1>
					<p className="text-zinc-400 mt-2 text-sm">Create your account</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Name */}
					<div>
						<label className="text-zinc-300 text-sm">Name</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="John Doe"
							className="mt-2 w-full bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
						/>
					</div>

					{/* Email */}
					<div>
						<label className="text-zinc-300 text-sm">Email</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="name@example.com"
							className="mt-2 w-full bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
						/>
					</div>

					{/* Password */}
					<div>
						<label className="text-zinc-300 text-sm">Password</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="••••••••"
							className="mt-2 w-full bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
						/>
					</div>

					{/* Role */}
					<div>
						<label className="text-zinc-300 text-sm">Account Type</label>
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							className="mt-2 w-full bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
						>
							<option value="user">User</option>
							<option value="artist">Artist</option>
						</select>
					</div>

					{/* Error */}
					{error && (
						<p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
							{error}
						</p>
					)}

					{/* Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-black  py-3 rounded-full transition"
					>
						{loading ? "Creating account..." : "Sign Up"}
					</button>
				</form>

				{/* Footer */}
				<p className="text-zinc-400 text-sm text-center mt-6">
					Already have an account?{" "}
					<Link to="/" className="text-white hover:underline">
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}
