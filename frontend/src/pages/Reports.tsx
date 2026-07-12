import React from 'react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const Reports: React.FC = () => {
  const { departments } = useStore();

  // Mock data for charts
  const utilData = departments.map(d => ({
    name: d.name.substring(0, 8),
    utilization: Math.floor(Math.random() * 100)
  }));

  const maintenanceFreq = [
    { name: 'Jan', requests: 4 },
    { name: 'Feb', requests: 7 },
    { name: 'Mar', requests: 5 },
    { name: 'Apr', requests: 12 },
    { name: 'May', requests: 8 },
    { name: 'Jun', requests: 15 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Reports & Analytics</h2>
        <button className="btn btn-secondary">Export Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Utilization by Department</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilData}>
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)'}} />
                <Bar dataKey="utilization" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Maintenance Frequency</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maintenanceFreq}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)'}} />
                <Line type="monotone" dataKey="requests" stroke="var(--accent-danger)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Most Used Assets</h3>
          <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Room B2: 24 bookings this month</li>
            <li>Van AF-001: 21 trips this month</li>
            <li>Projector AF-333: 15 uses</li>
          </ul>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Idle Assets</h3>
          <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Camera AF-0301: unused 60+ days</li>
            <li>Chair AF-0410: unused 45 days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
