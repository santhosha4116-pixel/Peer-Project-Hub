export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded border px-3 py-2 disabled:opacity-40"
      >
        Previous
      </button>

      <span className="rounded border px-3 py-2">
        Page {page} of {pages}
      </span>

      <button
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="rounded border px-3 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}