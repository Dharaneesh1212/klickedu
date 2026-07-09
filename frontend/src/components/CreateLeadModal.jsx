import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const STAGE_SUB_STAGES = {
  New: ["Not Contacted", "Trying to Reach"],
  Contacted: ["Interested", "Needs Info", "Call Back Later"],
  Qualified: ["Counselling Done", "Documents Requested"],
  Application: ["Documents Pending", "Application Submitted", "Under Review"],
  Admission: ["Offer Letter Received", "Payment Pending", "Visa in Process"],
  Converted: ["Enrolled", "Travel Confirmed"],
  Lost: ["Not Interested", "Budget Issue", "Chose Competitor", "Unresponsive"]
};

const CreateLeadModal = ({ onClose, onSuccess, employees }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    country: '',
    state: '',
    district: '',
    city: '',
    courseInterested: '',
    lookingFor: '',
    preferredCountry: '',
    leadSource: 'Other',
    status: 'New',
    stage: 'New',
    subStage: '',
    priority: '',
    nextFollowUpDate: '',
    lastContactedDate: '',
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
    const { name, value } = e.target;
    
    if (name === "stage") {
      setFormData({ ...formData, stage: value, subStage: '' }); // reset substage
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
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
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Lead</h2>
          <button type="button" className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {apiError && <div style={{ gridColumn: '1 / -1', color: 'var(--danger)', marginBottom: '16px', fontSize: '14px', padding: '8px', background: '#FEE2E2', borderRadius: '4px' }}>{apiError}</div>}
            
            <div className="input-group">
              <label>Name <span style={{color: 'red'}}>*</span></label>
              <input type="text" name="name" className={`input ${errors.name ? 'error' : ''}`} value={formData.name} onChange={handleChange} />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Mobile <span style={{color: 'red'}}>*</span></label>
              <input type="text" name="mobile" className={`input ${errors.mobile ? 'error' : ''}`} value={formData.mobile} onChange={handleChange} />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>

            <div className="input-group">
              <label>WhatsApp</label>
              <input type="text" name="whatsapp" className="input" value={formData.whatsapp} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Email <span style={{color: 'red'}}>*</span></label>
              <input type="email" name="email" className={`input ${errors.email ? 'error' : ''}`} value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Country</label>
              <input type="text" name="country" className="input" value={formData.country} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>State</label>
              <input type="text" name="state" className="input" value={formData.state} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>District</label>
              <input type="text" name="district" className="input" value={formData.district} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>City</label>
              <input type="text" name="city" className="input" value={formData.city} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Course Interested</label>
              <input type="text" name="courseInterested" className="input" value={formData.courseInterested} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>Looking For</label>
              <select name="lookingFor" className="select" value={formData.lookingFor} onChange={handleChange}>
                <option value="">Select</option>
                <option value="India">India</option>
                <option value="Abroad">Abroad</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Preferred Country</label>
              <input type="text" name="preferredCountry" className="input" value={formData.preferredCountry} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Lead Source</label>
              <select name="leadSource" className="select" value={formData.leadSource} onChange={handleChange}>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Social Media">Social Media</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Stage</label>
              <select name="stage" className="select" value={formData.stage} onChange={handleChange}>
                {Object.keys(STAGE_SUB_STAGES).map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label>Sub Stage</label>
              <select name="subStage" className="select" value={formData.subStage} onChange={handleChange}>
                <option value="">Select Sub Stage</option>
                {(STAGE_SUB_STAGES[formData.stage] || []).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label>Priority</label>
              <select name="priority" className="select" value={formData.priority} onChange={handleChange}>
                <option value="">Select Priority</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>

            <div className="input-group">
              <label>Assigned Employee</label>
              <select name="assignedEmployee" className="select" value={formData.assignedEmployee} onChange={handleChange}>
                <option value="">Unassigned</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.username}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label>Next Follow-up Date</label>
              <input type="date" name="nextFollowUpDate" className="input" value={formData.nextFollowUpDate} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>Last Contacted Date</label>
              <input type="date" name="lastContactedDate" className="input" value={formData.lastContactedDate} onChange={handleChange} />
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

