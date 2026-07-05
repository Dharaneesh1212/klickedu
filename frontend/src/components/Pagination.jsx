import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = React.memo(({ page, total, limit, onPageChange, onLimitChange }) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="pagination">
      <div className="page-info">
        Showing {total === 0 ? 0 : (page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
      </div>
      
      <div className="pagination-controls">
        <select
          className="select"
          style={{ padding: '6px', fontSize: '13px' }}
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10 records / page</option>
          <option value={25}>25 records / page</option>
          <option value={50}>50 records / page</option>
        </select>

        <button
          className="btn btn-secondary"
          style={{ padding: '6px' }}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 500, margin: '0 8px' }}>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          style={{ padding: '6px' }}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
});

export default Pagination;
