const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  if (totalPages === 0) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">

      {/* PREV BUTTON */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-2 rounded-lg font-medium transition
        ${currentPage === 1
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
      >
        Prev
      </button>

      {/* PAGE NUMBERS */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg font-medium transition
          ${currentPage === page
              ? "bg-blue-800 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
        >
          {page}
        </button>
      ))}

      {/* NEXT BUTTON */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-2 rounded-lg font-medium transition
        ${currentPage === totalPages
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;