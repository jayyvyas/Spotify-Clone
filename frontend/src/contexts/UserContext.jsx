import { createContext, useEffect, useState } from "react";
import api from "../config/api";

export const UserContext = createContext();

export default function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await api.get("/api/auth/me");
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
