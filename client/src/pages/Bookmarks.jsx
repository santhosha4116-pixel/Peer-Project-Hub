import { useEffect, useState } from "react";
import api, { authHeaders } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Bookmarks() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const headers = await authHeaders(user);
      const response = await api.get("/bookmarks", { headers });
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">My Bookmarks</h1>
      <p className="mt-2 text-slate-500">Projects you saved for later.</p>

      <div className="mt-6"><ErrorMessage message={error} /></div>

      {loading ? (
        <Loading />
      ) : projects.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center">
          You have no bookmarks yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}