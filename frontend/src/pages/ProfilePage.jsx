import { useContext, useEffect, useState } from "react";
import axios from "axios";
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

	const fallback = "http://localhost:3000/images/default-avatar.webp";

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get("http://localhost:3000/api/auth/me", {
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

			const res = await axios.patch("http://localhost:3000/api/auth/me", data, {
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
		return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
	}

	if (error) {
		return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />

			{/* HERO */}
			<div className="relative border-b border-white/5">
				<div className="max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
					{/* AVATAR */}
					<div className="relative group">
						<img
							src={user?.profileImage?.url || fallback}
							onError={(e) => (e.currentTarget.src = fallback)}
							alt="Profile"
							className="w-44 h-44 md:w-56 md:h-56 rounded-full object-cover border border-white/10 shadow-2xl"
						/>

						{isEditing && (
							<label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
								<span className="text-sm text-white">Change Photo</span>
								<input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
							</label>
						)}
					</div>

					{/* INFO */}
					<div className="text-center md:text-left">
						<p className="text-green-400 uppercase tracking-[0.3em] text-xs">Your Profile</p>

						<h1 className="text-5xl md:text-6xl font-black mt-2 text-white">{user?.name}</h1>

						<p className="text-zinc-400 mt-3">{user?.email}</p>

						{/* ACTIONS */}
						<div className="flex gap-3 mt-6 justify-center md:justify-start">
							<button
								onClick={() => setIsEditing((p) => !p)}
								className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition"
							>
								{isEditing ? "Cancel" : "Edit Profile"}
							</button>

							<button
								onClick={() => navigate("/reset-password")}
								className="px-5 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500 text-blue-400 transition"
							>
								Reset Password
							</button>

							<button
								onClick={() => setShowDeleteModal(true)}
								className="px-5 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500 text-red-400 transition"
							>
								Delete Account
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* DETAILS */}
			<div className="max-w-3xl mx-auto px-6 py-12">
				<div className="bg-white/5 border border-white/10 rounded-2xl p-6">
					<h2 className="text-sm uppercase tracking-wider text-zinc-400 mb-6">Account Details</h2>

					{/* NAME */}
					<div className="flex items-center justify-between py-4 border-b border-white/10">
						<span className="text-zinc-400">Name</span>

						{isEditing ? (
							<input
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="bg-black border border-white/10 px-3 py-2 rounded-md"
							/>
						) : (
							<span className="text-white">{user?.name}</span>
						)}
					</div>

					{/* EMAIL */}
					<div className="flex items-center justify-between py-4  border-white/10">
						<span className="text-zinc-400">Email</span>

						{isEditing ? (
							<input
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="bg-black border border-white/10 px-3 py-2 rounded-md"
							/>
						) : (
							<span className="text-white">{user?.email}</span>
						)}
					</div>

					{/* SAVE */}
					{isEditing && (
						<button
							onClick={handleSave}
							className="mt-6 w-full py-3 rounded-full bg-green-500 text-black z hover:bg-green-400 transition"
						>
							Save Changes
						</button>
					)}
				</div>
			</div>

			{/* MODAL */}
			{showDeleteModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
					<div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-md">
						<h2 className="text-lg text-red-400">Delete Account?</h2>
						<p className="text-sm text-zinc-400 mt-2">This action cannot be undone.</p>

						<div className="flex justify-end gap-3 mt-6">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20"
							>
								Cancel
							</button>

							<button
								onClick={async () => {
									setShowDeleteModal(false);
									await handleDeleteAccount();
								}}
								className="px-4 py-2 rounded-full bg-red-500 text-black hover:bg-red-400"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
