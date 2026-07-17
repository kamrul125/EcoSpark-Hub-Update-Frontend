type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
      >
        Previous
      </button>

      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded-full px-4 py-2 transition ${
              page === currentPage
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
      >
        Next
      </button>
    </div>
  );
}
