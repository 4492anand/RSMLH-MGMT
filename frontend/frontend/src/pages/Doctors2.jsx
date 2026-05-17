import { useEffect, useState } from 'react';
import { getDoctors, createDoctor, updateDoctor } from '../api/api';

const empty = { firstName: '', lastName: '', specialization: '', phoneNumber: '', email: '', address: '' };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDoctors = doctors.filter(d => 
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Practice', 'Dermatology'];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Doctors</h1>
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBox}
        />
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>{editId ? '✏️ Edit Doctor' : '➕ Add New Doctor'}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <input placeholder="First Name" required {...f('firstName')} style={styles.input} />
            <input placeholder="Last Name" required {...f('lastName')} style={styles.input} />
            <select required {...f('specialization')} style={styles.input}>
              <option value="">Select Specialization</option>
              {specializations.map(s => <option key={s}>{s}</option>)}
            </select>
            <input placeholder="Phone Number" required {...f('phoneNumber')} style={styles.input} />
            <input placeholder="Email" type="email" required {...f('email')} style={styles.input} />
            <input placeholder="Address" {...f('address')} style={styles.input} />
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.btnPrimary}>{editId ? 'Update Doctor' : 'Add Doctor'}</button>
            {editId && <button type="button" style={styles.btnSecondary} onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={styles.tableContainer}>
        <h3 style={styles.tableTitle}>Doctor List ({filteredDoctors.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Specialization</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map(d => (
              <tr key={d.doctorId} style={styles.tableRow}>
                <td style={styles.td}>{d.doctorId}</td>
                <td style={styles.td}><strong>{d.firstName} {d.lastName}</strong></td>
                <td style={styles.td}><span style={styles.specialization}>{d.specialization}</span></td>
                <td style={styles.td}>{d.phoneNumber}</td>
                <td style={styles.td}>{d.email}</td>
                <td style={styles.td}>
                  <button style={styles.btnEdit} onClick={() => handleEdit(d)}>✏️ Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDoctors.length === 0 && <p style={styles.noData}>No doctors found</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '24px', background: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', margin: 0, color: '#333' },
  searchBox: { padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', width: '250px', fontSize: '14px' },
  errorBox: { background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' },
  formContainer: { background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  formTitle: { fontSize: '16px', fontWeight: '600', marginTop: 0, marginBottom: '16px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit' },
  buttonGroup: { display: 'flex', gap: '8px' },
  btnPrimary: { padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  btnSecondary: { padding: '10px 20px', background: '#888', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  tableContainer: { background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tableTitle: { fontSize: '16px', fontWeight: '600', marginTop: 0, marginBottom: '16px', color: '#333' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#0066cc', color: '#fff' },
  th: { padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#666' },
  specialization: { background: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
  btnEdit: { padding: '6px 12px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  noData: { textAlign: 'center', color: '#999', padding: '20px' },
};
