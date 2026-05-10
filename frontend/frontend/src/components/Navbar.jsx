import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/patients', label: 'Patients' },
    { to: '/appointments', label: 'Appointments' },
  ];

  return (
    <nav style={s.nav}>
      <span style={s.logo}>
        🏥 <span style={s.logoBlack}>RSMLH</span>{' '}
        <span style={s.logoOrange}>Care</span>
      </span>
      <div style={s.links}>
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              ...s.link,
              ...(pathname === to ? s.linkActive : {}),
            }}
          >
            {label}
          </Link>
        ))}
      </div>
      <button style={s.bookBtn} onClick={() => navigate('/appointments')}>
        + Book Appointment
      </button>
    </nav>
  );
}

const s = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    height: '64px',
    background: '#fff',
    borderBottom: '1px solid #eee',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  logoBlack: { color: '#1a1a1a' },
  logoOrange: { color: '#f97316' },
  links: {
    display: 'flex',
    gap: '4px',
    marginRight: '24px',
  },
  link: {
    padding: '6px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#555',
    fontWeight: '500',
    fontSize: '15px',
    border: '1px solid transparent',
  },
  linkActive: {
    border: '1px solid #f97316',
    color: '#f97316',
    borderRadius: '6px',
  },
  bookBtn: {
    padding: '8px 20px',
    background: '#f97316',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
};
