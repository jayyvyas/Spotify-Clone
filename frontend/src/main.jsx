import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import axios from "axios";
import AlbumDetailsPage from "./pages/AlbumDetailsPage.jsx";
import RootRedirect from "./pages/RootRedirect.jsx";
import UploadSongPage from "./pages/UploadSongPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UserAlbumsPage from "./pages/UserAlbumPage.jsx";
import UploadAlbumPage from "./pages/UploadAlbumPage.jsx";
import UserProvider from "./contexts/UserContext.jsx";
import EditSongPage from "./pages/EditSongPage.jsx";
import ResetPasswordPage from "./pages/PasswordReset.jsx";
import SongPlayerPage from "./pages/Player.jsx";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
	{ path: "/", element: <RootRedirect /> },
	{ path: "/login", element: <LoginPage /> },
	{ path: "/register", element: <RegisterPage /> },
	{ path: "/home", element: <HomePage /> },
	{ path: "/albums/:id", element: <AlbumDetailsPage /> },
	{ path: "/albums/:id/upload", element: <UploadSongPage /> },
	{ path: "/profile", element: <ProfilePage /> },
	{ path: "/my-albums", element: <UserAlbumsPage /> },
	{ path: "/upload-album", element: <UploadAlbumPage /> },
	{ path: "/songs/:id/edit", element: <EditSongPage /> },
	{ path: "/reset-password", element: <ResetPasswordPage /> },
	{ path: "/songs/:songId/player", element: <SongPlayerPage /> },
]);

createRoot(document.getElementById("root")).render(
	<UserProvider>
		<RouterProvider router={router} />
	</UserProvider>,
);
