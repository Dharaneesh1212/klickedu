import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import "../index.css";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#64748B'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/lead/dashboard");
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="spinner" style={{ margin: "40px auto", display: "block" }}></div>;
  if (error) return <div className="empty-state error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="dashboard-container">
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#EEF2FF', borderRadius: '12px', color: '#4F46E5' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Total Leads</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px' }}>{stats.cards.totalLeads}</h3>
          </div>
        </div>

        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#ECFDF5', borderRadius: '12px', color: '#10B981' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>New Leads Today</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px' }}>{stats.cards.newLeadsToday}</h3>
          </div>
        </div>

        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#ECFDF5', borderRadius: '12px', color: '#10B981' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>New This Week</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px' }}>{stats.cards.newLeadsThisWeek}</h3>
          </div>
        </div>

        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#FEF3C7', borderRadius: '12px', color: '#F59E0B' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Converted Leads</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px' }}>{stats.cards.convertedLeads}</h3>
          </div>
        </div>

        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#FEE2E2', borderRadius: '12px', color: '#EF4444' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Pending Follow-ups</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px' }}>{stats.cards.pendingFollowUps}</h3>
          </div>
        </div>

        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #FECACA' }}>
          <div style={{ padding: '12px', background: '#FEF2F2', borderRadius: '12px', color: '#DC2626' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>Overdue Follow-ups</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#B91C1C' }}>{stats.cards.overdueFollowUps || 0}</h3>
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', color: 'var(--text-main)' }}>Leads by Stage</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.leadsByStage}>
                <XAxis dataKey="_id" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', color: 'var(--text-main)' }}>Leads by Source</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.charts.leadsBySource}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="var(--primary)"
                  label
                >
                  {stats.charts.leadsBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
