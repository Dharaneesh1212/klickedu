import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import LeadList from './components/LeadList';
import EmployeeList from './components/EmployeeList';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="header">
          <h1>ERP Lead Management Dashboard</h1>
        </div>
        
        <div className="nav-bar">
          <NavLink to="/leads" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Leads
          </NavLink>
          <NavLink to="/employees" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Employees
          </NavLink>
        </div>

        <div className="card">
          <Routes>
            <Route path="/" element={<Navigate to="/leads" replace />} />
            <Route path="/leads" element={<LeadList />} />
            <Route path="/employees" element={<EmployeeList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
