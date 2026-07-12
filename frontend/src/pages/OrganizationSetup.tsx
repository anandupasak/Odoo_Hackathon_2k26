import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const OrganizationSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'departments' | 'categories' | 'employees'>('departments');
  const { departments, categories, users } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Organization Setup</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary">+ Add New</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'departments' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('departments')}
        >
          Departments
        </button>
        <button 
          className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button 
          className={`btn ${activeTab === 'employees' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('employees')}
        >
          Employee Directory
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
        {activeTab === 'departments' && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Departments List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Department Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Head</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Parent Dept</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => {
                  const headUser = users.find(u => u.id === dept.headId);
                  const parentDept = departments.find(d => d.id === dept.parentId);
                  return (
                    <tr key={dept.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>{dept.name}</td>
                      <td style={{ padding: '1rem' }}>{headUser?.name || '---'}</td>
                      <td style={{ padding: '1rem' }}>{parentDept?.name || '---'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${dept.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                          {dept.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Asset Categories List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Category Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Optional Fields</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem' }}>{cat.name}</td>
                    <td style={{ padding: '1rem' }}>{cat.optionalFields.join(', ')}</td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'employees' && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Employee Directory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const dept = departments.find(d => d.id === user.departmentId);
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>{user.name}</td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${
                          user.role === 'Admin' ? 'badge-danger' : 
                          user.role === 'Asset Manager' ? 'badge-warning' : 
                          user.role === 'Department Head' ? 'badge-info' : 'badge-neutral'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{dept?.name || 'Unassigned'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Manage Role</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationSetup;
