import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen }) {
  const { pathname } = useLocation();

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/patients', label: 'Patients', icon: '👥' },
    { to: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { to: '/appointments', label: 'Appointments', icon: '📅' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ ...styles.sidebar, ...(isOpen ? {} : styles.sidebarClosed) }}>
      <div style={styles.sidebarContent}>
        {menuItems.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            style={{
              ...styles.menuItem,
              ...(pathname === to ? styles.menuItemActive : {}),
            }}
          >
            <span style={styles.menuIcon}>{icon}</span>
            {isOpen && <span>{label}</span>}
          </Link>
        ))}
      </div>

      <div style={styles.sidebarFooter}>
        <div style={styles.userInfo}>
          {isOpen && (
            <div>
              <p style={styles.userName}>Admin User</p>
              <p style={styles.userRole}>Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '250px',
    background: '#1a1a2e',
    color: '#fff',
    height: 'calc(100vh - 60px)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  },
  sidebarClosed: {
    width: '80px',
  },
  sidebarContent: {
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: '#ccc',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    borderLeft: '4px solid transparent',
    cursor: 'pointer',
  },
  menuItemActive: {
    background: '#16213e',
    color: '#fff',
    borderLeft: '4px solid #00d4ff',
  },
  menuIcon: {
    fontSize: '18px',
    minWidth: '24px',
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
  },
  userRole: {
    margin: 0,
    fontSize: '12px',
    color: '#999',
  },
};
