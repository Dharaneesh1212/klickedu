import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import CreateEmployeeModal from './CreateEmployeeModal';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isCreateEmployeeModalOpen, setIsCreateEmployeeModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/employee');
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'error' && <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Manage Employees</h2>
        <button className="btn btn-primary" onClick={() => setIsCreateEmployeeModalOpen(true)}>
          <Plus size={18} /> Create Employee
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {Array(3).fill(0).map((_, j) => (
                    <td key={j}><div className="skeleton"></div></td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan="3">
                  <div className="empty-state error">
                    Error: {error}
                    <br />
                    <button className="btn btn-secondary" onClick={fetchEmployees} style={{ marginTop: 8 }}>Retry</button>
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="empty-state">No employees found.</div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.username}</td>
                  <td>{emp.email}</td>
                  <td>{format(new Date(emp.createdAt), 'dd MMM yyyy')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isCreateEmployeeModalOpen && (
        <CreateEmployeeModal
          onClose={() => setIsCreateEmployeeModalOpen(false)}
          onSuccess={() => {
            fetchEmployees();
            showToast('Employee created successfully');
            setIsCreateEmployeeModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeList;
