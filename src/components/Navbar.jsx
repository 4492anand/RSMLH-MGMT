import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const links = [
    { to: '/patients', label: 'Patients' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/appointments', label: 'Appointments' },
  ];
  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>RSMLH Management</span>
      <div style={styles.links}>
        {links.map(({ to, label }) => (
          <Link key={to} to={to} style={{ ...styles.link, ...(pathname.startsWith(to) ? styles.active : {}) }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', gap: 24, padding: '12px 24px', background: '#1a73e8', color: '#fff' },
  brand: { fontWeight: 700, fontSize: 18, marginRight: 'auto' },
  links: { display: 'flex', gap: 16 },
  link: { color: '#fff', textDecoration: 'none', padding: '4px 10px', borderRadius: 4 },
  active: { background: 'rgba(255,255,255,0.25)' },
};
