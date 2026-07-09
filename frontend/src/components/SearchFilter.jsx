import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

const STAGE_SUB_STAGES = {
  New: ["Not Contacted", "Trying to Reach"],
  Contacted: ["Interested", "Needs Info", "Call Back Later"],
  Qualified: ["Counselling Done", "Documents Requested"],
  Application: ["Documents Pending", "Application Submitted", "Under Review"],
  Admission: ["Offer Letter Received", "Payment Pending", "Visa in Process"],
  Converted: ["Enrolled", "Travel Confirmed"],
  Lost: ["Not Interested", "Budget Issue", "Chose Competitor", "Unresponsive"]
};

const SearchFilter = React.memo(({ filters, updateFilter, resetFilters, employees }) => {
  const statuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
  const priorities = ['Hot', 'Warm', 'Cold'];
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <>
      <div className="filters-bar">
        <div className="search-box">
          <Search className="icon" size={18} />
          <input
            type="text"
            className="input"
            placeholder="Search Name, Mobile, Email, WhatsApp, Course, City..."
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
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        
        <div className="input-group" style={{ marginBottom: 0 }}>
          <select className="select" value={filters.leadSource} onChange={(e) => updateFilter('leadSource', e.target.value)}>
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Social Media">Social Media</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <select className="select" value={filters.assignedEmployee} onChange={(e) => updateFilter('assignedEmployee', e.target.value)}>
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.username}</option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0, flexDirection: 'row', alignItems: 'center' }}>
          <input type="date" className="input" value={filters.startDate} onChange={(e) => updateFilter('startDate', e.target.value)} title="Start Date" />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input type="date" className="input" value={filters.endDate} onChange={(e) => updateFilter('endDate', e.target.value)} title="End Date" />
        </div>

        <button className="btn btn-secondary" onClick={() => setIsAdvancedOpen(true)}>
          <Filter size={16} /> Advanced Filters
        </button>

        <button className="btn btn-secondary" onClick={resetFilters}>
          <X size={16} /> Reset
        </button>
      </div>

      {isAdvancedOpen && (
        <div className="modal-overlay" onClick={() => setIsAdvancedOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Advanced Filters</h2>
              <button className="btn-icon" onClick={() => setIsAdvancedOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label>Stage</label>
                <select className="select" value={filters.stage} onChange={(e) => { updateFilter('stage', e.target.value); updateFilter('subStage', ''); }}>
                  <option value="">All Stages</option>
                  {Object.keys(STAGE_SUB_STAGES).map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label>Sub Stage</label>
                <select className="select" value={filters.subStage} onChange={(e) => updateFilter('subStage', e.target.value)}>
                  <option value="">All Sub Stages</option>
                  {(STAGE_SUB_STAGES[filters.stage] || []).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Country</label>
                <input type="text" className="input" value={filters.country} onChange={(e) => updateFilter('country', e.target.value)} />
              </div>

              <div className="input-group">
                <label>Course Interested</label>
                <input type="text" className="input" value={filters.courseInterested} onChange={(e) => updateFilter('courseInterested', e.target.value)} />
              </div>

              <div className="input-group">
                <label>Follow-up Date Range</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="date" className="input" style={{flex: 1}} value={filters.followUpStartDate} onChange={(e) => updateFilter('followUpStartDate', e.target.value)} />
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                  <input type="date" className="input" style={{flex: 1}} value={filters.followUpEndDate} onChange={(e) => updateFilter('followUpEndDate', e.target.value)} />
                </div>
              </div>

            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { resetFilters(); setIsAdvancedOpen(false); }}>Clear All</button>
              <button className="btn btn-primary" onClick={() => setIsAdvancedOpen(false)}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default SearchFilter;
