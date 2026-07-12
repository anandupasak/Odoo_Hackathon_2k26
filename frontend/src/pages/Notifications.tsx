import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, currentUser } = useStore();
  
  // Filter notifications for current user (or all if admin for demo purposes)
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id || currentUser?.role === 'Admin');

  useEffect(() => {
    // Mark all as read when opening page
    myNotifs.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  }, [myNotifs, markNotificationRead]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Activity Logs & Notifications</h2>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <button className="btn btn-primary">All</button>
        <button className="btn btn-secondary">Alerts</button>
        <button className="btn btn-secondary">Approvals</button>
        <button className="btn btn-secondary">Bookings</button>
      </div>

      <div className="glass-panel" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {myNotifs.map(n => (
            <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ 
                width: '12px', height: '12px', borderRadius: '50%',
                background: n.type === 'Alert' ? 'var(--accent-danger)' : n.type === 'Approval' ? 'var(--accent-success)' : 'var(--accent-primary)' 
              }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{n.message}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <span className={`badge ${n.type === 'Alert' ? 'badge-danger' : n.type === 'Approval' ? 'badge-success' : 'badge-info'}`}>
                  {n.type}
                </span>
              </div>
            </div>
          ))}
          {myNotifs.length === 0 && (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
              No activity logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
