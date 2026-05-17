import { useEffect, useState } from 'react';
import { getDoctors, createDoctor, updateDoctor } from '../api/api';

const empty = { firstName: '', lastName: '', specialization: '', phoneNumber: '', email: '', address: '' };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => getDoctors().then(r => setDoctors(r.data)).catch(() => setError('Failed to load doctors'));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) await updateDoctor(editId, form);
      else await createDoctor(form);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (d) => {
    setEditId(d.doctorId);
    setForm({ firstName: d.firstName, lastName: d.lastName, specialization: d.specialization, phoneNumber: d.phoneNumber, email: d.email, address: d.address });
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm(prev => ({ ...prev, [k]: e.target.value })) });

  return (
    <div style={styles.page}>
      <h2>Doctors</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>{editId ? 'Edit Doctor' : 'Add Doctor'}</h3>
        <div style={styles.grid}>
          <input placeholder="First Name" required {...f('firstName')} />
          <input placeholder="Last Name" required {...f('lastName')} />
          <input placeholder="Specialization" required {...f('specialization')} />
          <input placeholder="Phone Number (10 digits)" required {...f('phoneNumber')} />
          <input placeholder="Email" type="email" required {...f('email')} />
          <input placeholder="Address" {...f('address')} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" style={styles.btn}>{editId ? 'Update' : 'Add Doctor'}</button>
          {editId && <button type="button" style={styles.btnSecondary} onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>{['ID', 'Name', 'Specialization', 'Phone', 'Email', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {doctors.map(d => (
            <tr key={d.doctorId}>
              <td style={styles.td}>{d.doctorId}</td>
              <td style={styles.td}>{d.firstName} {d.lastName}</td>
              <td style={styles.td}>{d.specialization}</td>
              <td style={styles.td}>{d.phoneNumber}</td>
              <td style={styles.td}>{d.email}</td>
              <td style={styles.td}>
                <button style={styles.btnSm} onClick={() => handleEdit(d)}>Edit</button>
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
  btnSm: { padding: '4px 10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#1a73e8', color: '#fff', padding: '8px 12px', textAlign: 'left' },
  td: { padding: '8px 12px', borderBottom: '1px solid #ddd' },
};
