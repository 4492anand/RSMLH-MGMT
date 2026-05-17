import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatients, getDoctors, getAppointments } from '../api/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, completed: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, d, a] = await Promise.all([getPatients(), getDoctors(), getAppointments()]);
        const appts = a.data || [];
        setStats({
          doctors: d.data?.length || 0,
          patients: p.data?.length || 0,
          appointments: appts.length,
          completed: appts.filter(x => x.status?.toLowerCase() === 'completed').length,
        });
        setRecent(appts.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    { label: 'Doctors', value: stats.doctors, icon: '👨‍⚕️' },
    { label: 'Patients', value: stats.patients, icon: '👥' },
    { label: 'Appointments', value: stats.appointments, icon: '📅' },
    { label: 'Completed', value: stats.completed, icon: '✅', highlight: true },
  ];

  const quickActions = [
    { label: 'View Doctors', icon: '👨‍⚕️', path: '/doctors' },
    { label: 'Add Patient', icon: '➕', path: '/patients' },
    { label: 'Schedule Appointment', icon: '📋', path: '/appointments' },
    { label: 'View All Appointments', icon: '🔍', path: '/appointments' },
  ];

  const statusColor = s => s?.toLowerCase() === 'completed' ? '#22c55e' : s?.toLowerCase() === 'cancelled' ? '#ef4444' : '#f97316';

  return (
    <div style={s.page}>
      {/* Hero Banner */}
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>
            Welcome to <span style={s.orange}>RSMLH Care</span>
          </h1>
          <p style={s.heroSub}>
            Manage your hospital operations seamlessly — doctors, patients &amp; appointments in one place.
          </p>
          <div style={s.heroActions}>
            <button style={s.btnPrimary} onClick={() => navigate('/appointments')}>Book Appointment</button>
            <button style={s.btnOutline} onClick={() => navigate('/patients')}>Register Patient</button>
          </div>
        </div>
        <span style={s.heroEmoji}>📋</span>
      </div>

      {/* Stat Cards */}
      <div style={s.grid4}>
        {statCards.map(({ label, value, icon, highlight }) => (
          <div key={label} style={{ ...s.card, ...(highlight ? s.cardHighlight : {}) }}>
            <span style={s.cardIcon}>{icon}</span>
            <div>
              <div style={s.cardValue}>{value}</div>
              <div style={s.cardLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={s.sectionTitle}>Quick Actions</h2>
      <div style={s.grid4}>
        {quickActions.map(({ label, icon, path }) => (
          <button key={label} style={s.actionCard} onClick={() => navigate(path)}>
            <span style={s.actionIcon}>{icon}</span>
            <span style={s.actionLabel}>{label}</span>
          </button>
        ))}
      </div>

      {/* Recent Appointments */}
      <h2 style={s.sectionTitle}>Recent Appointments</h2>
      <div style={s.tableWrap}>
        {loading ? (
          <p style={s.empty}>Loading...</p>
        ) : recent.length === 0 ? (
          <p style={s.empty}>No appointments found</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                {['Patient', 'Doctor', 'Date', 'Time', 'Status'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((a, i) => (
                <tr key={i} style={s.tr}>
                  <td style={s.td}>{a.patientName || 'N/A'}</td>
                  <td style={s.td}>{a.doctorName || 'N/A'}</td>
                  <td style={s.td}>{a.date || 'N/A'}</td>
                  <td style={s.td}>{a.time || 'N/A'}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: statusColor(a.status) }}>
                      {a.status || 'Scheduled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '28px 32px', background: '#f3f4f6', minHeight: '100vh' },
  orange: { color: '#f97316' },

  hero: {
    background: 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)',
    border: '1px solid #fed7aa',
    borderRadius: '16px',
    padding: '36px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  heroTitle: { fontSize: '28px', fontWeight: '800', color: '#1a1a1a', marginBottom: '10px' },
  heroSub: { color: '#6b7280', fontSize: '15px', marginBottom: '24px', maxWidth: '480px' },
  heroActions: { display: 'flex', gap: '12px' },
  heroEmoji: { fontSize: '80px', lineHeight: 1 },
  btnPrimary: {
    padding: '10px 22px', background: '#f97316', color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
  },
  btnOutline: {
    padding: '10px 22px', background: 'transparent', color: '#f97316',
    border: '2px solid #f97316', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
  },

  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '28px',
  },
  card: {
    background: '#fff', borderRadius: '12px', padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  cardHighlight: { border: '2px solid #f97316', background: '#fff7ed' },
  cardIcon: { fontSize: '36px' },
  cardValue: { fontSize: '28px', fontWeight: '800', color: '#1a1a1a' },
  cardLabel: { fontSize: '13px', color: '#6b7280', marginTop: '2px' },

  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '14px' },

  actionCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
    padding: '28px 16px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '12px', cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
  },
  actionIcon: { fontSize: '36px' },
  actionLabel: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a' },

  tableWrap: {
    background: '#fff', borderRadius: '12px', padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: '28px',
  },
  empty: { color: '#9ca3af', textAlign: 'center', padding: '24px 0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { borderBottom: '2px solid #f3f4f6' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px 14px', fontSize: '14px', color: '#4b5563' },
  badge: {
    padding: '3px 10px', borderRadius: '20px', color: '#fff',
    fontSize: '12px', fontWeight: '600',
  },
};
