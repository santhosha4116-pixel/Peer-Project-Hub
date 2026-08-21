import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Peer Project Hub
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-indigo-600">Projects</Link>

          {user ? (
            <>
              <Link to="/bookmarks" className="hover:text-indigo-600">Bookmarks</Link>
              <Link
                to="/projects/new"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
              >
                Add Project
              </Link>
              <button onClick={handleLogout} className="text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600">Login</Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}