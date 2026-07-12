import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const AssetDirectory: React.FC = () => {
  const { assets, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? asset.categoryId === filterCategory : true;
    const matchesStatus = filterStatus ? asset.status === filterStatus : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Assets</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Register Asset</button>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Search by tag, serial, or name..." 
          style={{ flex: 1, minWidth: '250px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="input-field" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input-field" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Allocated">Allocated</option>
          <option value="Reserved">Reserved</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Tag</th>
              <th style={{ padding: '0.75rem 1rem' }}>Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Location</th>
              <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map(asset => {
              const category = categories.find(c => c.id === asset.categoryId);
              return (
                <tr key={asset.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{asset.tag}</td>
                  <td style={{ padding: '1rem' }}>{asset.name}</td>
                  <td style={{ padding: '1rem' }}>{category?.name || '---'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${
                      asset.status === 'Available' ? 'badge-success' : 
                      asset.status === 'Allocated' ? 'badge-info' : 
                      asset.status === 'Under Maintenance' ? 'badge-warning' : 'badge-neutral'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{asset.location}</td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View</button>
                  </td>
                </tr>
              )
            })}
            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No assets found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal would go here for + Register Asset */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '400px' }}>
            <h3>Register Asset Modal Stub</h3>
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDirectory;
