import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { parseISO, isBefore, isAfter, isEqual } from 'date-fns';

const Bookings: React.FC = () => {
  const { assets, bookings } = useStore();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sharedResources = assets.filter(a => a.isShared);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAsset || !date || !startTime || !endTime) {
      setError('Please fill all fields.');
      return;
    }

    const startDateTime = parseISO(`${date}T${startTime}`);
    const endDateTime = parseISO(`${date}T${endTime}`);

    if (isBefore(endDateTime, startDateTime) || isEqual(startDateTime, endDateTime)) {
      setError('End time must be after start time.');
      return;
    }

    // Overlap validation
    const resourceBookings = bookings.filter(b => b.assetId === selectedAsset && b.status !== 'Cancelled');
    const hasOverlap = resourceBookings.some(b => {
      const bStart = parseISO(b.startTime);
      const bEnd = parseISO(b.endTime);
      
      // Overlap logic:
      // (start1 < end2) && (end1 > start2)
      return isBefore(startDateTime, bEnd) && isAfter(endDateTime, bStart);
    });

    if (hasOverlap) {
      setError(`Conflict: Requested slot overlaps with an existing booking.`);
      return;
    }

    setSuccess('Booking confirmed successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Resource Booking</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Book a Resource</h3>
          
          {error && <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1rem' }}>{error}</div>}
          {success && <div className="badge badge-success" style={{ display: 'block', padding: '0.75rem', marginBottom: '1rem' }}>{success}</div>}

          <form onSubmit={handleBook}>
            <div className="input-group">
              <label>Select Resource</label>
              <select className="input-field" value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)}>
                <option value="">-- Choose Shared Resource --</option>
                {sharedResources.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.location})</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Start Time</label>
                <input type="time" className="input-field" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>End Time</label>
                <input type="time" className="input-field" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Book Slot</button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Upcoming Bookings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.length > 0 ? bookings.map(b => {
              const asset = assets.find(a => a.id === b.assetId);
              const startDate = new Date(b.startTime);
              const endDate = new Date(b.endTime);
              return (
                <div key={b.id} style={{ display: 'flex', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ width: '8px', background: b.status === 'Upcoming' ? 'var(--accent-primary)' : b.status === 'Ongoing' ? 'var(--accent-success)' : 'var(--text-muted)' }}></div>
                  <div style={{ padding: '1rem', flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{asset?.name} <span className="badge badge-neutral ml-2">{b.status}</span></div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      {startDate.toLocaleDateString()} | {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Cancel</button>
                  </div>
                </div>
              );
            }) : (
              <div style={{ color: 'var(--text-muted)' }}>No bookings found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
