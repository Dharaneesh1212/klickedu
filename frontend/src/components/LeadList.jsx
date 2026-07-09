import React, { useState, useEffect } from 'react';
import { Eye, Edit2, AlertCircle, Plus, Trash2, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import useLeads from '../hooks/useLeads';
import Pagination from './Pagination';
import SearchFilter from './SearchFilter';
import LeadDetailsModal from './LeadDetailsModal';
import EditLeadModal from './EditLeadModal';
import CreateLeadModal from './CreateLeadModal';

const LeadList = () => {
  const {
    leads,
    total,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    fetchLeads,
  } = useLeads();

  const [employees, setEmployees] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employee');
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openView = (id) => {
    setSelectedLeadId(id);
    setIsViewModalOpen(true);
  };

  const openEdit = (id) => {
    setSelectedLeadId(id);
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status) => {
    return <span className={`badge ${status?.toLowerCase()}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    const colors = { Hot: '#FEE2E2', Warm: '#FEF3C7', Cold: '#DBEAFE' };
    const textColors = { Hot: '#DC2626', Warm: '#D97706', Cold: '#2563EB' };
    return (
      <span className="badge" style={{ background: colors[priority], color: textColors[priority] }}>
        {priority}
      </span>
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      try {
        await api.delete(`/lead/${id}`);
        showToast('Lead deleted successfully');
        fetchLeads();
      } catch (err) {
        showToast(err.message || 'Failed to delete lead', 'error');
      }
    }
  };

  const handleSort = (field) => {
    if (filters.sortField === field) {
      updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      updateFilter('sortField', field);
      updateFilter('sortOrder', 'asc');
    }
  };

  const SortableHeader = ({ field, label }) => (
    <th onClick={() => handleSort(field)} style={{ cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {label}
        {filters.sortField === field && (
          filters.sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
        )}
      </div>
    </th>
  );

  return (
    <div>
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'error' && <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <SearchFilter
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        employees={employees}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '12px' }}>
        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} /> Create Lead
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <SortableHeader field="name" label="Lead Name" />
              <th>Mobile</th>
              <SortableHeader field="status" label="Status" />
              <SortableHeader field="stage" label="Stage" />
              <SortableHeader field="priority" label="Priority" />
              <th>Assigned To</th>
              <SortableHeader field="nextFollowUpDate" label="Next Follow-up" />
              <SortableHeader field="createdAt" label="Created Date" />
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(filters.limit)].map((_, i) => (
                <tr key={i}>
                  {Array(9).fill(0).map((_, j) => (
                    <td key={j}><div className="skeleton"></div></td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan="9">
                  <div className="empty-state error">
                    Error: {error}
                    <br />
                    <button className="btn btn-secondary" onClick={fetchLeads} style={{ marginTop: 8 }}>Retry</button>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="empty-state">No leads found.</div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const isOverdue = lead.isOverdue;
                return (
                  <tr key={lead._id} style={isOverdue ? { backgroundColor: '#FEF2F2' } : {}}>
                    <td>{lead.name}</td>
                    <td>{lead.mobile}</td>
                    <td>{getStatusBadge(lead.status)}</td>
                    <td><span className="badge" style={{ background: '#F3F4F6', color: '#374151' }}>{lead.stage}</span></td>
                    <td>{getPriorityBadge(lead.priority)}</td>
                    <td>{lead.assignedEmployee ? lead.assignedEmployee.username : 'Unassigned'}</td>
                    <td>
                      {lead.nextFollowUpDate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isOverdue ? '#DC2626' : 'var(--text-muted)' }}>
                          {isOverdue && <Clock size={14} />}
                          {format(new Date(lead.nextFollowUpDate), 'dd MMM yyyy')}
                        </div>
                      ) : '-'}
                    </td>
                    <td>{format(new Date(lead.createdAt), 'dd MMM yyyy')}</td>
                    <td>
                      <button className="btn-icon" onClick={() => openView(lead._id)} title="View Details">
                        <Eye size={18} />
                      </button>
                      <button className="btn-icon" onClick={() => openEdit(lead._id)} title="Edit Lead">
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(lead._id)} title="Delete Lead" style={{ color: 'var(--danger)' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={filters.page}
        total={total}
        limit={filters.limit}
        onPageChange={(val) => updateFilter('page', val)}
        onLimitChange={(val) => updateFilter('limit', val)}
      />

      {isViewModalOpen && (
        <LeadDetailsModal
          leadId={selectedLeadId}
          onClose={() => setIsViewModalOpen(false)}
          employees={employees}
        />
      )}

      {isEditModalOpen && (
        <EditLeadModal
          leadId={selectedLeadId}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            fetchLeads();
            showToast('Lead updated successfully');
            setIsEditModalOpen(false);
          }}
          employees={employees}
        />
      )}

      {isCreateModalOpen && (
        <CreateLeadModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            fetchLeads();
            showToast('Lead created successfully');
            setIsCreateModalOpen(false);
          }}
          employees={employees}
        />
      )}
    </div>
  );
};

export default LeadList;
