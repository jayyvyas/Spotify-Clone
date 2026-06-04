import { useState } from "react";
import Navbar from "./Navbar";
import api from "../config/api";

export default function ResetPasswordPage() {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [message, setMessage] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");

		if (newPassword !== confirmPassword) {
			setError("New password and Confirm Password do not match!");
			return;
		}

		const data = { oldPassword, newPassword };

		try {
			await api.post("/api/auth/password", data, {
				withCredentials: true,
			});
			setConfirmPassword("");
			setOldPassword("");
			setNewPassword("");

			setMessage("Password updated successfully.");
			setTimeout(() => {
				setMessage("");
			}, 3000);
		} catch (error) {
			setError(error?.response?.data?.message || "Something went wrong.");
		}
	}

	return (
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-16 select-none">
			{/* Ambient Background Blur Canvas */}
			<div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-green-500/10 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10">
				<Navbar />

				{/* HERO BANNER SECTION */}
				<div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-900/40 via-zinc-950/20 to-zinc-950 backdrop-blur-md">
					<div className="max-w-4xl mx-auto px-6 py-14 text-center md:text-left">
						<span className="inline-block uppercase text-[10px] font-black tracking-[0.3em] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full mb-3">
							Account Security
						</span>
						<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
							Reset Password
						</h1>
						<p className="text-zinc-400 mt-1 text-sm sm:text-base font-medium">
							Update your verification tokens regularly to safeguard your library identity.
						</p>
					</div>
				</div>

				{/* CENTRALIZED COMPACT GLASS FORM */}
				<div className="max-w-xl mx-auto px-6 py-12">
					<div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-900 p-6 sm:p-8 rounded-3xl shadow-2xl">
						<h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-900 pb-3">
							Security Credentials
						</h2>

						<form onSubmit={handleSubmit} className="space-y-5">
							{/* INPUT block 1: OLD PASS */}
							<div className="space-y-2">
								<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-1">
									Current Password
								</label>
								<input
									type="password"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
									placeholder="Enter current password"
									className="w-full bg-zinc-950/60 text-white px-4 py-3.5 rounded-2xl border border-zinc-800/80 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-zinc-600 font-medium"
								/>
							</div>

							{/* INPUT block 2: NEW PASS */}
							<div className="space-y-2">
								<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-1">
									New Password
								</label>
								<input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="Enter new password"
									className="w-full bg-zinc-950/60 text-white px-4 py-3.5 rounded-2xl border border-zinc-800/80 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-zinc-600 font-medium"
								/>
							</div>

							{/* INPUT block 3: CONFIRM PASS */}
							<div className="space-y-2">
								<label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider ml-1">
									Confirm New Password
								</label>
								<input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirm new password"
									className="w-full bg-zinc-950/60 text-white px-4 py-3.5 rounded-2xl border border-zinc-800/80 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-zinc-600 font-medium"
								/>
							</div>

							{/* ALERT FEEDBACK LAYOUTS */}
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

							{/* ACTION COMMIT BUTTON */}
							<button
								type="submit"
								className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] text-black font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.2)] mt-2"
							>
								Update Password
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
