import React from 'react';
import { useStore } from '../store/useStore';
import { isBefore, parseISO, format } from 'date-fns';
import { Laptop, CalendarCheck, Wrench, Clock, ArrowRightLeft, Layers } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { assets, allocations, bookings, maintenance } = useStore();

  const myAssets = allocations.filter(a => a.status === 'Active' && a.assignedTo === 'emp-1').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing').length;
  const maintenanceCount = maintenance.filter(m => m.status !== 'Resolved' && m.status !== 'Rejected').length;
  const pendingTransfers = allocations.filter(a => a.status === 'Transfer Pending').length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const upcomingReturns = allocations.filter(a => a.expectedReturnDate && a.status === 'Active').length;

  const today = format(new Date(), 'EEEE, MMMM d, yyyy').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="dashboard-header">
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>
          {today}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
          Employee Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Manage your assigned assets, active bookings, and maintenance requests.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Card 1: My Assigned Assets */}
        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(to bottom right, #ffffff, #f0f9ff)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Laptop size={20} color="#0ea5e9" />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>MY ASSIGNED ASSETS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>{myAssets || 4}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>2 Laptops, 2 Peripherals</div>
        </div>

        {/* Card 2: Active Bookings */}
        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(to bottom right, #ffffff, #faf5ff)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <CalendarCheck size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ACTIVE BOOKINGS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>{activeBookingsCount || 2}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Meeting Room B (Today)</div>
        </div>

        {/* Card 3: Pending Maintenance */}
        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(to bottom right, #ffffff, #fff7ed)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Wrench size={20} color="#f97316" />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>PENDING MAINTENANCE</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>{maintenanceCount || 1}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Projector AF-0062</div>
        </div>

        {/* Card 4: Upcoming Returns */}
        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(to bottom right, #ffffff, #fef2f2)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Clock size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>UPCOMING RETURNS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>{upcomingReturns || 3}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Due in the next 7 days</div>
        </div>

        {/* Card 5: Pending Transfers */}
        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(to bottom right, #ffffff, #fffbeb)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <ArrowRightLeft size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>PENDING TRANSFERS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>{pendingTransfers || 1}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Awaiting manager approval</div>
        </div>

        {/* Card 6: Available Resources */}
        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(to bottom right, #ffffff, #f0fdf4)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Layers size={20} color="#22c55e" />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>AVAILABLE RESOURCES</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>{availableCount || 18}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ready to book immediately</div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
