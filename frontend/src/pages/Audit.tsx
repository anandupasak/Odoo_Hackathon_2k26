import React from 'react';

const Audit: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Asset Audit Cycles</h2>
        <button className="btn btn-primary">+ New Audit Cycle</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Q3 Audit: Engineering Dept</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Auditors: A. Rao, Z. Iqbal | Date: 1-15 Jul</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Asset</th>
              <th style={{ padding: '0.75rem 1rem' }}>Expected Location</th>
              <th style={{ padding: '0.75rem 1rem' }}>Verification</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1rem', fontWeight: 600 }}>AF-0012 Dell Laptop</td>
              <td style={{ padding: '1rem' }}>Desk 212</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge badge-success">Verified</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1rem', fontWeight: 600 }}>AF-4421 Office Chair</td>
              <td style={{ padding: '1rem' }}>Desk 214</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge badge-danger">Missing</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1rem', fontWeight: 600 }}>AF-9899 Monitor</td>
              <td style={{ padding: '1rem' }}>Desk 215</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge badge-warning">Damaged</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--accent-warning)', fontWeight: 600 }}>2 assets flagged - discrepancy report generated automatically</div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-secondary">Close Audit Cycle</button>
        </div>
      </div>
    </div>
  );
};

export default Audit;
