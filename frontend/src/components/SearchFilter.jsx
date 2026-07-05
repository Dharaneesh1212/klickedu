import React from 'react';
import { Search, X } from 'lucide-react';

const SearchFilter = React.memo(({ filters, updateFilter, resetFilters, employees }) => {
  const statuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];

  return (
    <div className="filters-bar">
      <div className="search-box">
        <Search className="icon" size={18} />
        <input
          type="text"
          className="input"
          placeholder="Search Name, Mobile, Email..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        {filters.search && (
          <button 
            className="btn-icon" 
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => updateFilter('search', '')}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="input-group" style={{ marginBottom: 0 }}>
        <select
          className="select"
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="input-group" style={{ marginBottom: 0 }}>
        <select
          className="select"
          value={filters.assignedEmployee}
          onChange={(e) => updateFilter('assignedEmployee', e.target.value)}
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.username}</option>
          ))}
        </select>
      </div>

      <div className="input-group" style={{ marginBottom: 0, flexDirection: 'row', alignItems: 'center' }}>
        <input
          type="date"
          className="input"
          value={filters.startDate}
          onChange={(e) => updateFilter('startDate', e.target.value)}
          title="Start Date"
        />
        <span style={{ color: 'var(--text-muted)' }}>-</span>
        <input
          type="date"
          className="input"
          value={filters.endDate}
          onChange={(e) => updateFilter('endDate', e.target.value)}
          title="End Date"
        />
      </div>

      <button className="btn btn-secondary" onClick={resetFilters}>
        <X size={16} /> Reset
      </button>
    </div>
  );
});

export default SearchFilter;
