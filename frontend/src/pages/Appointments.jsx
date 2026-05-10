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

  return (
    <div style={styles.page}>
      <h2>Appointments</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleCreate} style={styles.form}>
        <h3>Schedule Appointment</h3>
        <div style={styles.grid}>
          <select required {...cf('patientId')}>
            <option value="">Select Patient</option>
            {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.firstName} {p.lastName}</option>)}
          </select>
          <select required {...cf('doctorId')}>
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>{d.firstName} {d.lastName} — {d.specialization}</option>)}
          </select>
          <input type="datetime-local" required {...cf('appointmentDateTime')} />
          <input placeholder="Reason for Visit" required {...cf('reasonForVisit')} />
        </div>
        <button type="submit" style={{ ...styles.btn, marginTop: 8 }}>Schedule</button>
      </form>

      <form onSubmit={handleUpdate} style={styles.form}>
        <h3>Complete Appointment</h3>
        <div style={styles.grid}>
          <input placeholder="Appointment ID" required value={updateId} onChange={e => setUpdateId(e.target.value)} />
          <input placeholder="Diagnosis" required {...uf('diagnosis')} />
          <input placeholder="Treatment" required {...uf('treatment')} />
          <input placeholder="Prescriptions" required {...uf('prescriptions')} />
          <input placeholder="Test Results" required {...uf('testResults')} />
          <input placeholder="Follow-up Instructions" required {...uf('followUpInstructions')} />
        </div>
        <button type="submit" style={{ ...styles.btn, marginTop: 8 }}>Complete</button>
      </form>

      {detail && (
        <div style={styles.detail}>
          <h3>Appointment #{detail.appointmentId} Detail</h3>
          <p><b>Patient:</b> {detail.patient?.firstName} {detail.patient?.lastName}</p>
          <p><b>Doctor:</b> {detail.doctor?.firstName} {detail.doctor?.lastName} ({detail.doctor?.specialization})</p>
          <p><b>Date/Time:</b> {detail.appointmentDateTime}</p>
          <p><b>Status:</b> {detail.status}</p>
          <p><b>Reason:</b> {detail.reasonForVisit}</p>
          {detail.diagnosis && <p><b>Diagnosis:</b> {detail.diagnosis}</p>}
          {detail.treatment && <p><b>Treatment:</b> {detail.treatment}</p>}
          {detail.prescriptions && <p><b>Prescriptions:</b> {detail.prescriptions}</p>}
          {detail.testResults && <p><b>Test Results:</b> {detail.testResults}</p>}
          {detail.followUpInstructions && <p><b>Follow-up:</b> {detail.followUpInstructions}</p>}
          <button style={styles.btnSecondary} onClick={() => setDetail(null)}>Close</button>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>{['ID', 'Patient', 'Doctor', 'Date/Time', 'Status', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.appointmentId}>
              <td style={styles.td}>{a.appointmentId}</td>
              <td style={styles.td}>{a.patientName}</td>
              <td style={styles.td}>{a.doctorName}</td>
              <td style={styles.td}>{a.appointmentDateTime}</td>
              <td style={styles.td}>{a.status}</td>
              <td style={styles.td}>
                <button style={styles.btnSm} onClick={() => handleViewDetail(a.appointmentId)}>View</button>
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
  form: { background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  btn: { padding: '8px 16px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  btnSecondary: { padding: '8px 16px', background: '#888', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  btnSm: { padding: '4px 10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#1a73e8', color: '#fff', padding: '8px 12px', textAlign: 'left' },
  td: { padding: '8px 12px', borderBottom: '1px solid #ddd' },
  detail: { background: '#e8f0fe', padding: 16, borderRadius: 8, marginBottom: 16 },
};
