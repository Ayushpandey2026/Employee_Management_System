const getPageNumbers = (page, totalPages) => {
  const maxButtons = 5;
  let end = Math.min(totalPages, Math.max(1, page - 2) + maxButtons - 1);
  let start = Math.max(1, end - maxButtons + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row">
      <p className="text-sm text-gray-600">
        Showing <span className="font-medium">{from}</span> to{' '}
        <span className="font-medium">{to}</span> of <span className="font-medium">{total}</span>{' '}
        employees
      </p>

      <div className="flex items-center gap-1">
        <button
          className="btn-secondary px-3 py-1.5"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>

        {getPageNumbers(page, totalPages).map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              number === page
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          className="btn-secondary px-3 py-1.5"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}