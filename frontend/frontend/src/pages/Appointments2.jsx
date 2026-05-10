import { useEffect, useState } from 'react';
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, getPatients, getDoctors } from '../api/api';

const emptyCreate = { patientId: '', doctorId: '', appointmentDateTime: '', reasonForVisit: '' };
const emptyUpdate = { diagnosis: '', treatment: '', prescriptions: '', testResults: '', followUpInstructions: '' };

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [updateForm, setUpdateForm] = useState(emptyUpdate);
  const [updateId, setUpdateId] = useState('');
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const load = () => {
    getAppointments().then(r => setAppointments(r.data)).catch(() => setError('Failed to load appointments'));
    getPatients().then(r => setPatients(r.data));
    getDoctors().then(r => setDoctors(r.data));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...createForm,
        patientId: Number(createForm.patientId),
        doctorId: Number(createForm.doctorId),
        appointmentDateTime: createForm.appointmentDateTime.replace('T', 'T') + ':00',
      };
      await createAppointment(payload);
      setCreateForm(emptyCreate);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule appointment');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateAppointment(updateId, { appointmentId: updateId, ...updateForm });
      setUpdateForm(emptyUpdate);
      setUpdateId('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment');
    }
  };

  const handleViewDetail = async (id) => {
    const r = await getAppointmentById(id);
    setDetail(r.data);
  };

  const cf = (k) => ({ value: createForm[k], onChange: e => setCreateForm(p => ({ ...p, [k]: e.target.value })) });
  const uf = (k) => ({ value: updateForm[k], onChange: e => setUpdateForm(p => ({ ...p, [k]: e.target.value })) });

  const filteredAppointments = appointments.filter(a =>
    (a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Appointments</h1>
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBox}
        />
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>📅 Schedule New Appointment</h3>
        <form onSubmit={handleCreate} style={styles.form}>
          <div style={styles.grid}>
            <select required {...cf('patientId')} style={styles.input}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.firstName} {p.lastName}</option>)}
            </select>
            <select required {...cf('doctorId')} style={styles.input}>
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>{d.firstName} {d.lastName} — {d.specialization}</option>)}
            </select>
            <input type="datetime-local" required {...cf('appointmentDateTime')} style={styles.input} />
            <input placeholder="Reason for Visit" required {...cf('reasonForVisit')} style={styles.input} />
          </div>
          <button type="submit" style={styles.btnPrimary}>Schedule Appointment</button>
        </form>
      </div>

      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>✅ Complete Appointment</h3>
        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.grid}>
            <input placeholder="Appointment ID" required value={updateId} onChange={e => setUpdateId(e.target.value)} style={styles.input} />
            <input placeholder="Diagnosis" required {...uf('diagnosis')} style={styles.input} />
            <input placeholder="Treatment" required {...uf('treatment')} style={styles.input} />
            <input placeholder="Prescriptions" required {...uf('prescriptions')} style={styles.input} />
            <input placeholder="Test Results" required {...uf('testResults')} style={styles.input} />
            <input placeholder="Follow-up Instructions" required {...uf('followUpInstructions')} style={styles.input} />
          </div>
          <button type="submit" style={styles.btnSecondary}>Complete Appointment</button>
        </form>
      </div>

      {detail && (
        <div style={styles.detailContainer}>
          <div style={styles.detailHeader}>
            <h3 style={styles.detailTitle}>📋 Appointment #{detail.appointmentId} Details</h3>
            <button style={styles.btnClose} onClick={() => setDetail(null)}>✕</button>
          </div>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>👤 Patient:</span>
              <span>{detail.patient?.firstName} {detail.patient?.lastName}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>👨‍⚕️ Doctor:</span>
              <span>{detail.doctor?.firstName} {detail.doctor?.lastName} ({detail.doctor?.specialization})</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>📅 Date/Time:</span>
              <span>{detail.appointmentDateTime}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>🏥 Status:</span>
              <span style={styles.statusBadge}>{detail.status}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>📝 Reason:</span>
              <span>{detail.reasonForVisit}</span>
            </div>
            {detail.diagnosis && <div style={styles.detailItem}>
              <span style={styles.detailLabel}>🔍 Diagnosis:</span>
              <span>{detail.diagnosis}</span>
            </div>}
            {detail.treatment && <div style={styles.detailItem}>
              <span style={styles.detailLabel}>💊 Treatment:</span>
              <span>{detail.treatment}</span>
            </div>}
            {detail.prescriptions && <div style={styles.detailItem}>
              <span style={styles.detailLabel}>🔬 Prescriptions:</span>
              <span>{detail.prescriptions}</span>
            </div>}
            {detail.testResults && <div style={styles.detailItem}>
              <span style={styles.detailLabel}>📊 Test Results:</span>
              <span>{detail.testResults}</span>
            </div>}
            {detail.followUpInstructions && <div style={styles.detailItem}>
              <span style={styles.detailLabel}>📌 Follow-up:</span>
              <span>{detail.followUpInstructions}</span>
            </div>}
          </div>
        </div>
      )}

      <div style={styles.tableContainer}>
        <h3 style={styles.tableTitle}>Appointment List ({filteredAppointments.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Date/Time</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(a => (
              <tr key={a.appointmentId} style={styles.tableRow}>
                <td style={styles.td}>{a.appointmentId}</td>
                <td style={styles.td}><strong>{a.patientName}</strong></td>
                <td style={styles.td}>{a.doctorName}</td>
                <td style={styles.td}>{a.appointmentDateTime}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, background: a.status === 'Completed' ? '#4CAF50' : '#FF9800' }}>
                    {a.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.btnView} onClick={() => handleViewDetail(a.appointmentId)}>👁️ View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAppointments.length === 0 && <p style={styles.noData}>No appointments found</p>}
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
  btnPrimary: { padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  btnSecondary: { padding: '10px 20px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  detailContainer: { background: '#e8f5e9', borderLeft: '4px solid #4CAF50', padding: '20px', borderRadius: '8px', marginBottom: '24px' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  detailTitle: { fontSize: '16px', fontWeight: '600', margin: 0, color: '#333' },
  btnClose: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: { fontWeight: '600', color: '#666', fontSize: '13px' },
  statusBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '4px', color: '#fff', fontSize: '12px', fontWeight: '600', width: 'fit-content' },
  tableContainer: { background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tableTitle: { fontSize: '16px', fontWeight: '600', marginTop: 0, marginBottom: '16px', color: '#333' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#0066cc', color: '#fff' },
  th: { padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#666' },
  btnView: { padding: '6px 12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  noData: { textAlign: 'center', color: '#999', padding: '20px' },
};
