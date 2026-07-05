import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const CreateLeadModal = ({ onClose, onSuccess, employees }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    courseInterested: '',
    leadSource: 'Other',
    status: 'New',
    assignedEmployee: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Mobile must be 10 digits';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;
    setSaving(true);

    try {
      const payload = { ...formData };
      if (!payload.assignedEmployee) {
        payload.assignedEmployee = null; 
      }
      await api.post(`/lead`, payload);
      onSuccess();
    } catch (err) {
      setApiError(err.message || 'Creation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Lead</h2>
          <button type="button" className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {apiError && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '14px', padding: '8px', background: '#FEE2E2', borderRadius: '4px' }}>{apiError}</div>}
            
            <div className="input-group">
              <label>Name <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="name" 
                className={`input ${errors.name ? 'error' : ''}`}
                value={formData.name} 
                onChange={handleChange} 
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Mobile <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="mobile" 
                className={`input ${errors.mobile ? 'error' : ''}`}
                value={formData.mobile} 
                onChange={handleChange} 
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>

            <div className="input-group">
              <label>Email <span style={{color: 'red'}}>*</span></label>
              <input 
                type="email" 
                name="email" 
                className={`input ${errors.email ? 'error' : ''}`}
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Lead Source</label>
              <select 
                name="leadSource" 
                className="select" 
                value={formData.leadSource} 
                onChange={handleChange}
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Social Media">Social Media</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Status</label>
              <select 
                name="status" 
                className="select" 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="input-group">
              <label>Assigned Employee</label>
              <select 
                name="assignedEmployee" 
                className="select" 
                value={formData.assignedEmployee} 
                onChange={handleChange}
              >
                <option value="">Unassigned</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.username}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;
