import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{project.title}</h2>

      <p className="mt-2 line-clamp-3 text-slate-600">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          By {project.ownerName || project.ownerEmail}
        </span>

        <Link
          to={`/projects/${project._id}`}
          className="font-semibold text-indigo-600"
        >
          View Project →
        </Link>
      </div>
    </article>
  );
}