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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
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
              <div className="details-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{lead.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mobile</span>
                  <span className="detail-value">{lead.mobile}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">WhatsApp</span>
                  <span className="detail-value">{lead.whatsapp || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{lead.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Country</span>
                  <span className="detail-value">{lead.country || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">State</span>
                  <span className="detail-value">{lead.state || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">District</span>
                  <span className="detail-value">{lead.district || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">City</span>
                  <span className="detail-value">{lead.city || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Course Interested</span>
                  <span className="detail-value">{lead.courseInterested || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Looking For</span>
                  <span className="detail-value">{lead.lookingFor || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Preferred Country</span>
                  <span className="detail-value">{lead.preferredCountry || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Lead Source</span>
                  <span className="detail-value">{lead.leadSource}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Stage</span>
                  <span className="detail-value">
                    <span className="badge" style={{ background: '#F3F4F6', color: '#374151' }}>{lead.stage}</span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sub Stage</span>
                  <span className="detail-value">{lead.subStage || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Priority</span>
                  <span className="detail-value">{getPriorityBadge(lead.priority) || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assigned Employee</span>
                  <span className="detail-value">
                    {lead.assignedEmployee ? lead.assignedEmployee.username : 'Unassigned'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Next Follow-up</span>
                  <span className="detail-value">
                    {lead.nextFollowUpDate ? format(new Date(lead.nextFollowUpDate), 'dd MMM yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Contacted</span>
                  <span className="detail-value">
                    {lead.lastContactedDate ? format(new Date(lead.lastContactedDate), 'dd MMM yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created Date</span>
                  <span className="detail-value">
                    {format(new Date(lead.createdAt), 'dd MMM yyyy, hh:mm a')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
                <NotesSection 
                  leadId={lead._id} 
                  notes={lead.notes} 
                  onNotesChange={handleNotesChange}
                  employees={employees}
                />
                
                <div className="timeline-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <h3 style={{ marginTop: 0, fontSize: '16px' }}>Activity Timeline</h3>
                  {(!lead.activities || lead.activities.length === 0) ? (
                    <div className="empty-state">No activities yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                      {[...lead.activities].reverse().map(act => (
                        <div key={act._id} style={{ display: 'flex', gap: '12px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px', flexShrink: 0 }}></div>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 500 }}>{act.action}</p>
                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-muted)' }}>{act.details}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{format(new Date(act.date || act.createdAt || new Date()), 'dd MMM yyyy, hh:mm a')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
