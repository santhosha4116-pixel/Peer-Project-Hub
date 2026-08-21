import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { authHeaders } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [bookmarked, setBookmarked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
    
    
  }, [id, user]);

  const loadData = async () => {
    try {
      const projectResponse = await api.get(`/projects/${id}`);
      const commentResponse = await api.get(`/projects/${id}/comments`);

      setProject(projectResponse.data);
      setComments(commentResponse.data);
      
      if (user) {
        const headers = await authHeaders(user);
        const bookmarkResponse = await api.get("/bookmarks", { headers });

        setBookmarked(
          bookmarkResponse.data.some((item) => item._id === id)
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load project");
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const headers = await authHeaders(user);

      if (bookmarked) {
        await api.delete(`/bookmarks/${id}`, { headers });
        setBookmarked(false);
      } else {
        await api.post(`/bookmarks/${id}`, {}, { headers });
        setBookmarked(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update bookmark");
    }
  };

  const deleteProject = async () => {
    if (!window.confirm("Delete this project?")) return;

    try {
      const headers = await authHeaders(user);
      await api.delete(`/projects/${id}`, { headers });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete project");
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const headers = await authHeaders(user);

      const response = await api.post(
        `/projects/${id}/comments`,
        { text: comment, rating },
        { headers }
      );

      setComments([response.data, ...comments]);
      setComment("");
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add review");
    }
  };

  if (!project) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <ErrorMessage message={error} />
        <Loading />
      </main>
    );
  }

  const isOwner = user?.uid === project.ownerUid;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <ErrorMessage message={error} />

      <article className="rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-indigo-600">Student Project</p>
            <h1 className="mt-1 text-4xl font-bold">{project.title}</h1>
            <p className="mt-2 text-sm text-slate-500">
              By {project.ownerName || project.ownerEmail}
            </p>
          </div>

          <button
            onClick={toggleBookmark}
            className="rounded-lg border px-4 py-2"
          >
            {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
        </div>

        <p className="mt-8 whitespace-pre-wrap leading-7 text-slate-700">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border px-5 py-3 hover:bg-slate-900 hover:text-white"
          >
            GitHub
          </a>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border px-5 py-3 hover:bg-slate-900 hover:text-white"
            >
              Live Demo
            </a>
          )}

          {isOwner && (
            <>
              <Link
                to={`/projects/${id}/edit`}
                className="rounded-lg border px-5 py-3 hover:bg-slate-900 hover:text-white"
              >
                Edit
              </Link>

              <button
                onClick={deleteProject}
                className="rounded-lg border border-red-200 px-5 py-3 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </article>

      <section className="mt-8 rounded-2xl border bg-white p-8">
        <h2 className="text-2xl font-bold">Reviews & Comments</h2>

        {user ? (
          <form onSubmit={submitComment} className="mt-6 space-y-4">
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-lg border px-4 py-3"
            >
              <option value="5">★★★★★ - 5</option>
              <option value="4">★★★★☆ - 4</option>
              <option value="3">★★★☆☆ - 3</option>
              <option value="2">★★☆☆☆ - 2</option>
              <option value="1">★☆☆☆☆ - 1</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a helpful review..."
              rows="4"
              className="w-full rounded-lg border px-4 py-3"
            />

            <button className="rounded-lg bg-indigo-600 px-5 py-3 text-white">
              Add Review
            </button>
          </form>
        ) : (
          <p className="mt-4 text-slate-600">
            Please <Link to="/login" className="text-indigo-600">login</Link> to review this project.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {comments.length === 0 ? (
            <p className="text-slate-500">No reviews yet.</p>
          ) : (
            comments.map((item) => (
              <div key={item._id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between">
                  <strong>{item.userName || item.userEmail}</strong>
                  <span>{"★".repeat(item.rating)}</span>
                </div>
                <p className="mt-2 text-slate-700">{item.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}