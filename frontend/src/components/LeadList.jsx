import React, { useState, useEffect } from 'react';
import { Eye, Edit2, AlertCircle, Plus } from 'lucide-react';
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
    return <span className={`badge ${status.toLowerCase()}`}>{status}</span>;
  };

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
              <th>Lead Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(filters.limit)].map((_, i) => (
                <tr key={i}>
                  {Array(7).fill(0).map((_, j) => (
                    <td key={j}><div className="skeleton"></div></td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state error">
                    Error: {error}
                    <br />
                    <button className="btn btn-secondary" onClick={fetchLeads} style={{ marginTop: 8 }}>Retry</button>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">No leads found.</div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.mobile}</td>
                  <td>{lead.email}</td>
                  <td>{getStatusBadge(lead.status)}</td>
                  <td>{lead.assignedEmployee ? lead.assignedEmployee.username : 'Unassigned'}</td>
                  <td>{format(new Date(lead.createdAt), 'dd MMM yyyy')}</td>
                  <td>
                    <button className="btn-icon" onClick={() => openView(lead._id)} title="View Details">
                      <Eye size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => openEdit(lead._id)} title="Edit Lead">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
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
