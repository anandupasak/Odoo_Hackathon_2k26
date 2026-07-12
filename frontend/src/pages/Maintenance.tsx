import React from 'react';
import { useStore } from '../store/useStore';

const Maintenance: React.FC = () => {
  const { maintenance, assets } = useStore();

  const renderKanbanColumn = (status: string, title: string) => {
    const colItems = maintenance.filter(m => m.status === status);
    return (
      <div style={{ 
        flex: 1, 
        minWidth: '250px',
        background: 'var(--bg-secondary)', 
        borderRadius: 'var(--radius-md)', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid var(--glass-border)'
      }}>
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {title} <span className="badge badge-neutral" style={{ marginLeft: '0.5rem' }}>{colItems.length}</span>
        </h4>
        {colItems.map(m => {
          const asset = assets.find(a => a.id === m.assetId);
          return (
            <div key={m.id} className="glass-panel" style={{ padding: '1rem', borderTop: `3px solid ${m.priority === 'High' ? 'var(--accent-danger)' : m.priority === 'Medium' ? 'var(--accent-warning)' : 'var(--accent-success)'}` }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{asset?.tag} - {asset?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{m.issueDescription}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-neutral">{m.priority}</span>
                <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Update</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Maintenance Management</h2>
        <button className="btn btn-primary">+ Raise Request</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', flex: 1 }}>
        {renderKanbanColumn('Pending', 'Pending Approval')}
        {renderKanbanColumn('Approved', 'Approved')}
        {renderKanbanColumn('Technician Assigned', 'Tech Assigned')}
        {renderKanbanColumn('In Progress', 'In Progress')}
        {renderKanbanColumn('Resolved', 'Resolved')}
      </div>
    </div>
  );
};

export default Maintenance;
