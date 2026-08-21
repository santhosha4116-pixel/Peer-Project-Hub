import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { authHeaders } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

export default function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    githubUrl: "",
    liveUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const headers = await authHeaders(user);

      await api.post(
        "/projects",
        {
          ...form,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
        { headers }
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectForm
      title="Create Project"
      form={form}
      updateField={updateField}
      handleSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitText="Create Project"
    />
  );
}

function ProjectForm({
  title,
  form,
  updateField,
  handleSubmit,
  loading,
  error,
  submitText,
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">{title}</h1>

        <div className="mt-6">
          <ErrorMessage message={error} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="Project title"
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            placeholder="Describe your project"
            rows="6"
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            name="tags"
            value={form.tags}
            onChange={updateField}
            placeholder="Tags: React, MongoDB, Express"
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            name="githubUrl"
            type="url"
            value={form.githubUrl}
            onChange={updateField}
            placeholder="GitHub repository URL"
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            name="liveUrl"
            type="url"
            value={form.liveUrl}
            onChange={updateField}
            placeholder="Live demo URL (optional)"
            className="w-full rounded-lg border px-4 py-3"
          />

          <button
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : submitText}
          </button>
        </form>
      </div>
    </main>
  );
}