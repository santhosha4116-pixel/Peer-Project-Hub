import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../utils/api";
import ProjectCard from "../components/ProjectCard";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/projects?search=${encodeURIComponent(search)}&page=${page}&limit=6`
      );
      setProjects(response.data.projects);
      setPages(response.data.pages);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 rounded-2xl bg-slate-900 p-8 text-white">
        <p className="mb-2 text-sm text-indigo-300">Student developer community</p>
        <h1 className="text-4xl font-bold">Discover student coding projects.</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Share your projects, learn from your peers, leave useful reviews and
          save projects you want to revisit.
        </p>

        <div className="mt-6 flex max-w-xl items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-900">
          <Search size={20} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search projects..."
            className="w-full outline-none"
          />
        </div>
      </section>

      <ErrorMessage message={error} />
    
      {loading ? (
        <Loading />
      ) : projects.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          No projects found.
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>

          <Pagination
            page={page}
            pages={pages}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}