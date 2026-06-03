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
			const res = await api.post("/api/auth/password", data, {
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
		<div className="min-h-screen bg-black text-white">
			<Navbar />

			{/* HERO */}
			<div className=" text-center relative border-b-2 border-white/5">
				<div className=" inline-block px-10 text-left mx-auto py-15">
					<p className="text-green-400 uppercase tracking-[0.3em] text-xs">Account Security</p>

					<h1 className="text-5xl md:text-6xl font-black mt-2">Reset Password</h1>

					<p className="text-green-400 mt-4 text-lg">Update your password to keep your account secure.</p>
				</div>
			</div>

			{/* FORM */}
			<div className=" text-center max-w-3xl mx-auto px-6 py-12">
				<div className="text-left bg-white/5 border border-white/10 rounded-2xl p-6">
					<h2 className="text-sm uppercase tracking-wider text-zinc-400 mb-6">Password Details</h2>

					<div className="space-y-6">
						<div>
							<label className="block text-green-400 mb-2">Current Password</label>

							<input
								type="password"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
								placeholder="Enter current password"
								className="w-full bg-black border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-green-500"
							/>
						</div>

						<div>
							<label className="block text-green-400 mb-2">New Password</label>

							<input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Enter new password"
								className="w-full bg-black border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-green-500"
							/>
						</div>

						<div>
							<label className="block text-green-400 mb-2">Confirm New Password</label>

							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm new password"
								className="w-full bg-black border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-green-500"
							/>
						</div>

						<button
							type="submit"
							className="w-full py-3 rounded-full bg-zinc-800 text-white  hover:bg-green-400 transition font-medium"
							onClick={(e) => {
								handleSubmit(e);
							}}
						>
							Update Password
						</button>
						{message && (
							<div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm">
								{message}
							</div>
						)}
						{error && (
							<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
								{error}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
