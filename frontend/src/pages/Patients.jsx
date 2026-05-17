import { useEffect, useState } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../api/api';

const empty = { firstName: '', lastName: '', dateOfBirth: '', gender: '', address: '', phoneNumber: '', email: '', emergencyContact: '' };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => getPatients().then(r => setPatients(r.data)).catch(() => setError('Failed to load patients'));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) await updatePatient(editId, form);
      else await createPatient(form);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (p) => {
    setEditId(p.patientId);
    setForm({ firstName: p.firstName, lastName: p.lastName, dateOfBirth: p.dateOfBirth, gender: p.gender, address: p.address, phoneNumber: p.phoneNumber, email: p.email, emergencyContact: p.emergencyContact });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    await deletePatient(id);
    load();
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm(prev => ({ ...prev, [k]: e.target.value })) });

  return (
    <div style={styles.page}>
      <h2>Patients</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>{editId ? 'Edit Patient' : 'Register Patient'}</h3>
        <div style={styles.grid}>
          <input placeholder="First Name" required {...f('firstName')} />
          <input placeholder="Last Name" required {...f('lastName')} />
          <input type="date" placeholder="Date of Birth" required {...f('dateOfBirth')} />
          <select required {...f('gender')}>
            <option value="">Gender</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          <input placeholder="Phone Number" required {...f('phoneNumber')} />
          <input placeholder="Email" type="email" required {...f('email')} />
          <input placeholder="Address" {...f('address')} style={{ gridColumn: 'span 2' }} />
          <input placeholder="Emergency Contact" {...f('emergencyContact')} style={{ gridColumn: 'span 2' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" style={styles.btn}>{editId ? 'Update' : 'Register'}</button>
          {editId && <button type="button" style={styles.btnSecondary} onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>{['ID', 'Name', 'DOB', 'Gender', 'Phone', 'Email', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.patientId}>
              <td style={styles.td}>{p.patientId}</td>
              <td style={styles.td}>{p.firstName} {p.lastName}</td>
              <td style={styles.td}>{p.dateOfBirth}</td>
              <td style={styles.td}>{p.gender}</td>
              <td style={styles.td}>{p.phoneNumber}</td>
              <td style={styles.td}>{p.email}</td>
              <td style={styles.td}>
                <button style={styles.btnSm} onClick={() => handleEdit(p)}>Edit</button>
                <button style={{ ...styles.btnSm, background: '#e53935' }} onClick={() => handleDelete(p.patientId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: { padding: 24 },
  error: { color: 'red' },
  form: { background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  btn: { padding: '8px 16px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  btnSecondary: { padding: '8px 16px', background: '#888', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  btnSm: { marginRight: 4, padding: '4px 10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#1a73e8', color: '#fff', padding: '8px 12px', textAlign: 'left' },
  td: { padding: '8px 12px', borderBottom: '1px solid #ddd' },
};
