import React from 'react';

export default function Settings() {
  const [settings, setSettings] = React.useState({
    hospitalName: 'RSMLH Care Hospital',
    hospitalAddress: '123 Medical Street, Healthcare City',
    hospitalPhone: '+1-800-HOSPITAL',
    hospitalEmail: 'info@rsmlh.com',
    darkMode: false,
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminder: '24',
  });

  const [savedMessage, setSavedMessage] = React.useState('');

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSavedMessage('✅ Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>⚙️ Settings</h1>

      {savedMessage && <div style={styles.successBox}>{savedMessage}</div>}

      <div style={styles.container}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Hospital Information</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Hospital Name</label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) => handleChange('hospitalName', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Address</label>
              <input
                type="text"
                value={settings.hospitalAddress}
                onChange={(e) => handleChange('hospitalAddress', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                value={settings.hospitalPhone}
                onChange={(e) => handleChange('hospitalPhone', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={settings.hospitalEmail}
                onChange={(e) => handleChange('hospitalEmail', e.target.value)}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Notification Settings</h2>
          <div style={styles.toggleGrid}>
            <div style={styles.toggleItem}>
              <label style={styles.toggleLabel}>Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                style={styles.checkbox}
              />
            </div>
            <div style={styles.toggleItem}>
              <label style={styles.toggleLabel}>SMS Notifications</label>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                style={styles.checkbox}
              />
            </div>
            <div style={styles.toggleItem}>
              <label style={styles.toggleLabel}>Appointment Reminder (hours before)</label>
              <select
                value={settings.appointmentReminder}
                onChange={(e) => handleChange('appointmentReminder', e.target.value)}
                style={styles.select}
              >
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
              </select>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Display Settings</h2>
          <div style={styles.toggleItem}>
            <label style={styles.toggleLabel}>Dark Mode</label>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleChange('darkMode', e.target.checked)}
              style={styles.checkbox}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>System Information</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Application Version:</span>
              <span>1.0.0</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Last Updated:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Database Status:</span>
              <span style={styles.statusOnline}>🟢 Connected</span>
            </div>
          </div>
        </div>

        <button style={styles.saveBtn} onClick={handleSave}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '24px', background: '#f5f5f5', minHeight: '100vh' },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#333' },
  successBox: { background: '#c8e6c9', color: '#2e7d32', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontWeight: '600' },
  container: { maxWidth: '900px' },
  section: { background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', marginTop: 0, marginBottom: '16px', color: '#333' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontWeight: '600', fontSize: '13px', color: '#666' },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' },
  toggleGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  toggleItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' },
  toggleLabel: { fontWeight: '600', fontSize: '14px', color: '#666' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  infoItem: { display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9f9f9', borderRadius: '6px' },
  infoLabel: { fontWeight: '600', color: '#666' },
  statusOnline: { color: '#4CAF50', fontWeight: '600' },
  saveBtn: { padding: '12px 32px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', marginTop: '16px' },
};
