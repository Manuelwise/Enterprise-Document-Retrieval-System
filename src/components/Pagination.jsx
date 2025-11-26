//pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-ghost"
      >
        Previous
      </button>
      
      {pages.map(page => (
        <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1 rounded border cursor-pointer ${
          currentPage === page
            ? 'btn btn-primary' // Current page styling
            : 'btn btn-ghost' // Non-current page styling
        }`}
    >
        {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-ghost"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;