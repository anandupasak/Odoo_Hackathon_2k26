import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  Settings, 
  Monitor, 
  ArrowRightLeft, 
  Calendar, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  Bell,
  LogOut,
  User,
  Search
} from 'lucide-react';
import './AppLayout.css';

const AppLayout: React.FC = () => {
  const { currentUser, logout, notifications } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null; // Will be handled by ProtectedRoute

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">AF</div>
          <h2>AssetFlow</h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          
          {currentUser.role === 'Admin' && (
            <NavLink to="/setup" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Settings size={20} /> Organization Setup
            </NavLink>
          )}
          
          <NavLink to="/assets" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Monitor size={20} /> My Assets
          </NavLink>
          
          <NavLink to="/allocations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ArrowRightLeft size={20} /> Allocations
          </NavLink>
          
          <NavLink to="/bookings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={20} /> Resource Booking
          </NavLink>
          
          <NavLink to="/maintenance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Wrench size={20} /> Maintenance
          </NavLink>
          
          <NavLink to="/logs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={20} /> Notifications
            {unreadCount > 0 && <span className="badge badge-danger ml-auto">{unreadCount}</span>}
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item btn-transparent" style={{ width: '100%', justifyContent: 'flex-start' }}>
            <User size={20} /> Profile
          </button>
          <button onClick={handleLogout} className="nav-item btn-transparent text-danger" style={{ width: '100%', justifyContent: 'flex-start' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left search-container">
             <Search size={18} className="search-icon" />
             <input type="text" placeholder="Global search..." className="search-input" />
          </div>
          <div className="header-right">
            <button className="icon-btn position-relative">
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-dot"></span>}
            </button>
            <div className="user-profile">
              <div className="user-info">
                 <span className="user-name">{currentUser.name}</span>
                 <span className="user-dept">{currentUser.department || 'ENGINEERING DEPT'}</span>
              </div>
              <div className="avatar">{currentUser.name.charAt(0)}</div>
            </div>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
