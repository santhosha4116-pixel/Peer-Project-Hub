import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { authHeaders } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";

export default function EditProject() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      const project = response.data;

      setForm({
        title: project.title,
        description: project.description,
        tags: project.tags.join(", "),
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load project");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = await authHeaders(user);

      await api.put(
        `/projects/${id}`,
        {
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        },
        { headers }
      );

      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update project");
    }
  };

  if (loading) return <Loading />;
  if (!form) return <ErrorMessage message={error} />;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <div className="mt-6"><ErrorMessage message={error} /></div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="title" value={form.title} onChange={updateField} required className="w-full rounded-lg border px-4 py-3" />
          <textarea name="description" value={form.description} onChange={updateField} rows="6" required className="w-full rounded-lg border px-4 py-3" />
          <input name="tags" value={form.tags} onChange={updateField} required className="w-full rounded-lg border px-4 py-3" />
          <input name="githubUrl" type="url" value={form.githubUrl} onChange={updateField} required className="w-full rounded-lg border px-4 py-3" />
          <input name="liveUrl" type="url" value={form.liveUrl} onChange={updateField} className="w-full rounded-lg border px-4 py-3" />

          <button className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white">
            Update Project
          </button>
        </form>
      </div>
    </main>
  );
}