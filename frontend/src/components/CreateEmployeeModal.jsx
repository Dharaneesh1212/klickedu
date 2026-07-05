import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const CreateEmployeeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await api.post(`/employee/register`, formData);
      onSuccess();
    } catch (err) {
      setApiError(err.message || 'Registration failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Employee</h2>
          <button type="button" className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {apiError && <div className="empty-state error" style={{ padding: '8px', marginBottom: '16px', fontSize: '14px' }}>{apiError}</div>}
            
            <div className="input-group">
              <label>Username <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="username" 
                className={`input ${errors.username ? 'error' : ''}`}
                value={formData.username} 
                onChange={handleChange} 
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
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
              <label>Password <span style={{color: 'red'}}>*</span></label>
              <input 
                type="password" 
                name="password" 
                className={`input ${errors.password ? 'error' : ''}`}
                value={formData.password} 
                onChange={handleChange} 
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label>Confirm Password <span style={{color: 'red'}}>*</span></label>
              <input 
                type="password" 
                name="confirmPassword" 
                className={`input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword} 
                onChange={handleChange} 
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
