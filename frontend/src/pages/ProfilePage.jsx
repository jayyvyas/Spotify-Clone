import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { UserContext } from "../contexts/UserContext";
import api from "../config/api";

export default function ProfilePage() {
	const { user, setUser } = useContext(UserContext);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({ name: "", email: "" });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const navigate = useNavigate();

	const fallback = `${import.meta.env.VITE_API_URL}/images/default-avatar.webp`;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await api.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
					withCredentials: true,
				});

				setUser(res.data.user);
				setFormData({
					name: res.data.user.name,
					email: res.data.user.email,
				});
			} catch (err) {
				setError(err.response?.data?.message || "Something went wrong.");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const handleChange = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleImageChange = (e) => {
		setImageFile(e.target.files?.[0]);
	};

	const handleSave = async () => {
		try {
			const data = new FormData();
			data.append("name", formData.name);
			data.append("email", formData.email);
			if (imageFile) data.append("profileImage", imageFile);

			const res = await api.patch(`${import.meta.env.VITE_API_URL}/api/auth/me`, data, {
				withCredentials: true,
				headers: { "Content-Type": "multipart/form-data" },
			});

			setUser(res.data.updatedUser);
			setIsEditing(false);
			setImageFile(null);
		} catch (err) {
			console.log(err?.response?.data?.message);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			await api.delete("/api/auth/me", {
				withCredentials: true,
			});

			navigate("/login");
		} catch (err) {
			console.log(err?.response?.data?.message);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 flex flex-col justify-between">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<div className="flex flex-col items-center gap-3">
						<svg className="animate-spin h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24">
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
						<p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest animate-pulse">
							Syncing Credentials...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
				<div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
					<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h2 className="text-xl font-bold text-white mb-1">Failed to load profile</h2>
				<p className="text-zinc-400 text-sm max-w-xs">{error}</p>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden pb-16 select-none">
			{/* Ambient Background Blur System */}
			<div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-green-500/10 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10">
				<Navbar />

				{/* HERO PROFILE SUMMARY ROW */}
				<div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-900/40 via-zinc-950/20 to-zinc-950 backdrop-blur-md">
					<div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-8 md:gap-10 text-center md:text-left">
						{/* AVATAR CANVAS HOVER CONTEXT */}
						<div className="relative group w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] border-2 border-zinc-800 flex-shrink-0">
							<img
								src={imageFile ? URL.createObjectURL(imageFile) : user?.profileImage?.url || fallback}
								onError={(e) => (e.currentTarget.src = fallback)}
								alt="Profile"
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
							/>

							{isEditing && (
								<label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
									<svg
										className="w-5 h-5 text-zinc-300 mb-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span className="text-[11px] font-bold uppercase tracking-wider text-white">
										Upload
									</span>
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
								</label>
							)}
						</div>

						{/* CORE PERSONAL DATA CONTAINER */}
						<div className="min-w-0 flex-1">
							<span className="inline-block uppercase text-[10px] font-black tracking-[0.3em] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full mb-3">
								{user?.role === "artist" ? "Artist Account" : "Verified Listener"}
							</span>

							<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white truncate leading-tight">
								{user?.name}
							</h1>

							<p className="text-zinc-400 mt-1 text-sm font-medium">{user?.email}</p>

							{/* CONTROLLER ACTION UTILITIES */}
							<div className="flex flex-wrap gap-2.5 mt-6 justify-center md:justify-start">
								<button
									onClick={() => {
										setIsEditing((p) => !p);
										if (isEditing) setImageFile(null); // Reset pending image upload context on drop
									}}
									className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 border ${
										isEditing
											? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
											: "bg-zinc-900/60 text-zinc-200 border-zinc-800/80 hover:bg-zinc-800 hover:text-white"
									}`}
								>
									{isEditing ? "Cancel Upload" : "Edit Profile"}
								</button>

								<button
									onClick={() => navigate("/reset-password")}
									className="px-4 py-2 rounded-full text-xs font-bold tracking-wide bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200"
								>
									Reset Password
								</button>

								<button
									onClick={() => setShowDeleteModal(true)}
									className="px-4 py-2 rounded-full text-xs font-bold tracking-wide bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-950/40 hover:border-red-500/40 transition-all duration-200"
								>
									Delete Account
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* MODULAR PROFILE INFORMATION ROWS */}
				<div className="max-w-2xl mx-auto px-6 py-12">
					<div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-900 p-6 sm:p-8 rounded-3xl shadow-xl">
						<h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-900 pb-3">
							Account Attributes
						</h2>

						<div className="space-y-5">
							{/* PARAMETER 1: FULL DISPLAY NAME */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-b border-zinc-900 pb-4">
								<span className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">
									Name
								</span>
								{isEditing ? (
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className="bg-zinc-950 text-white text-sm px-4 py-2 rounded-xl border border-zinc-800 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all w-full sm:w-64 font-medium"
									/>
								) : (
									<span className="text-zinc-100 text-sm font-bold truncate max-w-xs">
										{user?.name}
									</span>
								)}
							</div>

							{/* PARAMETER 2: USER EMAIL ID */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 pb-2">
								<span className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">
									Email
								</span>
								{isEditing ? (
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="bg-zinc-950 text-white text-sm px-4 py-2 rounded-xl border border-zinc-800 outline-none focus:border-green-500/80 focus:ring-4 focus:ring-green-500/10 transition-all w-full sm:w-64 font-medium"
									/>
								) : (
									<span className="text-zinc-100 text-sm font-bold truncate max-w-xs">
										{user?.email}
									</span>
								)}
							</div>
						</div>

						{/* CONDITIONAL CONTEXTUAL ACTION: COMMIT FORM */}
						{isEditing && (
							<button
								onClick={handleSave}
								className="mt-8 w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] text-black font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.2)]"
							>
								Save Changes
							</button>
						)}
					</div>
				</div>
			</div>

			{/* UPGRADED CONTEXTUAL MODAL SHEET */}
			{showDeleteModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 animate-fade-in px-4">
					<div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl w-full max-w-sm shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
						<div className="flex items-center gap-3 text-red-400">
							<div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
							<h2 className="text-md font-extrabold tracking-tight">Delete Account?</h2>
						</div>

						<p className="text-zinc-400 text-xs font-medium mt-3 leading-relaxed">
							This action is permanent and cannot be reversed. You will lose access to all uploaded
							compositions, audio tracks, and music library catalogs.
						</p>

						<div className="flex justify-end gap-2.5 mt-6">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
							>
								Cancel
							</button>

							<button
								onClick={async () => {
									setShowDeleteModal(false);
									await handleDeleteAccount();
								}}
								className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide bg-red-500 hover:bg-red-400 text-black shadow-md transition"
							>
								Delete Permanently
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
