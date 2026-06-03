import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get("http://localhost:3000/api/auth/me", {
					withCredentials: true,
				});
				setUser(res.data.user);
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>;
}
