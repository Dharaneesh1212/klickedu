import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import NotesSection from './NotesSection';

const LeadDetailsModal = ({ leadId, onClose, employees }) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await api.get(`/lead/${leadId}`);
        setLead(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch lead details');
      } finally {
        setLoading(false);
      }
    };
    if (leadId) fetchLead();
  }, [leadId]);

  const handleNotesChange = (updatedNotes) => {
    setLead((prev) => ({ ...prev, notes: updatedNotes }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Lead Details</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner"></div>
            </div>
          ) : error ? (
             <div className="empty-state error">{error}</div>
          ) : !lead ? (
            <div className="empty-state">Lead not found.</div>
          ) : (
            <>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{lead.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mobile</span>
                  <span className="detail-value">{lead.mobile}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{lead.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{lead.address || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Course Interested</span>
                  <span className="detail-value">{lead.courseInterested || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Lead Source</span>
                  <span className="detail-value">{lead.leadSource}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">
                    <span className={`badge ${lead.status.toLowerCase()}`}>{lead.status}</span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assigned Employee</span>
                  <span className="detail-value">
                    {lead.assignedEmployee ? lead.assignedEmployee.username : 'Unassigned'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created Date</span>
                  <span className="detail-value">
                    {format(new Date(lead.createdAt), 'dd MMM yyyy, hh:mm a')}
                  </span>
                </div>
              </div>

              <NotesSection 
                leadId={lead._id} 
                notes={lead.notes} 
                onNotesChange={handleNotesChange}
                employees={employees}
              />
            </>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
