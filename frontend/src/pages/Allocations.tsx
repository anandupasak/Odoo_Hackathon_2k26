import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const Allocations: React.FC = () => {
  const { assets, allocations, users, departments } = useStore();
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAssetId || !assigneeId) {
      setError('Please select an asset and an assignee.');
      return;
    }

    const asset = assets.find(a => a.id === selectedAssetId);
    if (!asset) return;

    if (asset.status === 'Allocated') {
      const currentAllocation = allocations.find(a => a.assetId === asset.id && a.status === 'Active');
      const currentUser = users.find(u => u.id === currentAllocation?.assigneeId);
      setError(`Already allocated to ${currentUser?.name || 'someone'}. Direct allocation is blocked - Submit a Transfer request instead.`);
      return;
    }

    if (asset.status !== 'Available') {
      setError(`Cannot allocate asset. Current status is ${asset.status}.`);
      return;
    }

    // Success logic in mock
    setSuccess(`Successfully allocated ${asset.name} to selected user.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Asset Allocation & Transfer</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>New Allocation / Transfer Request</h3>
          
          {error && (
            <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="badge badge-success" style={{ display: 'block', padding: '0.75rem', marginBottom: '1rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleAllocate}>
            <div className="input-group">
              <label>Select Asset</label>
              <select className="input-field" value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
                <option value="">-- Choose Asset --</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.tag} - {a.name} ({a.status})</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Assign To (Employee or Department)</label>
              <select className="input-field" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                <option value="">-- Choose Assignee --</option>
                <optgroup label="Employees">
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </optgroup>
                <optgroup label="Departments">
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            
            <div className="input-group">
              <label>Expected Return Date (Optional)</label>
              <input type="date" className="input-field" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Allocate Asset</button>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setError('Transfer request submitted for approval.')}>Request Transfer</button>
            </div>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Active Allocations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
            {allocations.filter(a => a.status === 'Active').map(alloc => {
              const asset = assets.find(a => a.id === alloc.assetId);
              const assignee = users.find(u => u.id === alloc.assigneeId) || departments.find(d => d.id === alloc.assigneeId);
              return (
                <div key={alloc.id} style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {asset?.tag} - {asset?.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Assigned to: <span style={{ color: 'var(--text-primary)' }}>{assignee?.name}</span>
                  </div>
                  {alloc.expectedReturnDate && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Expected Return: {alloc.expectedReturnDate}
                    </div>
                  )}
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Process Return</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allocations;
