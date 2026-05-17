import { useEffect, useState } from 'react';
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, getPatients, getDoctors } from '../api/api';

const emptyCreate = { patientId: '', doctorId: '', appointmentDateTime: '', reasonForVisit: '' };
const emptyUpdate = { diagnosis: '', treatment: '', prescriptions: '', testResults: '', followUpInstructions: '' };

const STATUS_COLORS = {
  SCHEDULED: { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
  COMPLETED: { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  CANCELLED: { bg: '#fff1f2', text: '#e11d48', dot: '#f43f5e' },
};

function Avatar({ name = '', size = 44 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `hsl(${hue},55%,60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>
      {initials || '?'}
    </div>
  );
}

function StatusPill({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.SCHEDULED;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, color: c.text, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {status}
    </span>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span style={s.modalTitle}>{title}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div style={s.field}>
      <span style={s.fieldLabel}>{label}</span>
      <span style={s.fieldValue}>{value}</span>
    </div>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [detail, setDetail] = useState(null);
  const [showBook, setShowBook] = useState(false);
  const [completeTarget, setCompleteTarget] = useState(null); // appointment object
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [updateForm, setUpdateForm] = useState(emptyUpdate);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    getAppointments().then(r => setAppointments(r.data)).catch(() => setError('Failed to load appointments'));
    getPatients().then(r => setPatients(r.data));
    getDoctors().then(r => setDoctors(r.data));
  };

  useEffect(() => { load(); }, []);

  const notify = (msg, isError = false) => {
    isError ? setError(msg) : setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 3500);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...createForm,
        patientId: Number(createForm.patientId),
        doctorId: Number(createForm.doctorId),
        appointmentDateTime: createForm.appointmentDateTime + ':00',
      };
      await createAppointment(payload);
      setCreateForm(emptyCreate);
      setShowBook(false);
      load();
      notify('Appointment booked successfully!');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to schedule appointment', true);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAppointment(completeTarget.appointmentId, { appointmentId: completeTarget.appointmentId, ...updateForm });
      setUpdateForm(emptyUpdate);
      setCompleteTarget(null);
      load();
      notify('Appointment completed!');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to complete appointment', true);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    const r = await getAppointmentById(id);
    setDetail(r.data);
  };

  const cf = (k) => ({ value: createForm[k], onChange: e => setCreateForm(p => ({ ...p, [k]: e.target.value })) });
  const uf = (k) => ({ value: updateForm[k], onChange: e => setUpdateForm(p => ({ ...p, [k]: e.target.value })) });

  const filtered = appointments.filter(a => {
    const matchSearch = !search ||
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = { ALL: appointments.length, SCHEDULED: 0, COMPLETED: 0, CANCELLED: 0 };
  appointments.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });

  return (
    <div style={s.page}>

      {/* Toast */}
      {(error || success) && (
        <div style={{ ...s.toast, background: error ? '#fee2e2' : '#dcfce7', color: error ? '#b91c1c' : '#15803d', borderLeft: `4px solid ${error ? '#ef4444' : '#22c55e'}` }}>
          {error || success}
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Appointments</h1>
          <p style={s.pageSubtitle}>{appointments.length} total appointments</p>
        </div>
        <button style={s.bookBtn} onClick={() => setShowBook(true)}>
          <span style={{ fontSize: 18 }}>+</span> Book Appointment
        </button>
      </div>

      {/* Search + Filter */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            placeholder="Search patient or doctor…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={s.filters}>
          {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map(st => (
            <button
              key={st}
              style={{ ...s.filterBtn, ...(filterStatus === st ? s.filterBtnActive : {}) }}
              onClick={() => setFilterStatus(st)}
            >
              {st} <span style={s.filterCount}>{counts[st]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 48 }}>📅</div>
          <p style={{ color: '#9ca3af', marginTop: 12 }}>No appointments found</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(a => (
            <div key={a.appointmentId} style={s.card}>
              <div style={s.cardTop}>
                <Avatar name={a.patientName || ''} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={s.cardPatient}>{a.patientName}</p>
                  <p style={s.cardDoctor}>Dr. {a.doctorName}</p>
                </div>
                <StatusPill status={a.status} />
              </div>

              <div style={s.cardMeta}>
                <span style={s.metaItem}>
                  🗓 {new Date(a.appointmentDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span style={s.metaItem}>
                  🕐 {new Date(a.appointmentDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div style={s.cardId}>#{a.appointmentId}</div>

              <div style={s.cardActions}>
                <button style={s.actionBtn} onClick={() => handleViewDetail(a.appointmentId)}>View Details</button>
                {a.status === 'SCHEDULED' && (
                  <button style={{ ...s.actionBtn, ...s.actionBtnPrimary }} onClick={() => { setCompleteTarget(a); setUpdateForm(emptyUpdate); }}>
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBook && (
        <Modal title="📅 Book Appointment" onClose={() => setShowBook(false)}>
          <form onSubmit={handleCreate}>
            <div style={s.formGrid}>
              <div style={s.formGroup}>
                <label style={s.label}>Patient</label>
                <select required {...cf('patientId')} style={s.input}>
                  <option value="">Select patient…</option>
                  {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Doctor</label>
                <select required {...cf('doctorId')} style={s.input}>
                  <option value="">Select doctor…</option>
                  {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>{d.firstName} {d.lastName} — {d.specialization}</option>)}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Date & Time</label>
                <input type="datetime-local" required {...cf('appointmentDateTime')} style={s.input} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Reason for Visit</label>
                <input placeholder="e.g. Annual checkup" required {...cf('reasonForVisit')} style={s.input} />
              </div>
            </div>
            <div style={s.modalFooter}>
              <button type="button" style={s.cancelBtn} onClick={() => setShowBook(false)}>Cancel</button>
              <button type="submit" style={s.submitBtn} disabled={loading}>{loading ? 'Booking…' : 'Book Appointment'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Complete Appointment Modal */}
      {completeTarget && (
        <Modal title={`✅ Complete — #${completeTarget.appointmentId}`} onClose={() => setCompleteTarget(null)}>
          <div style={s.completeInfo}>
            <Avatar name={completeTarget.patientName || ''} size={36} />
            <div>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{completeTarget.patientName}</p>
              <p style={{ color: '#6b7280', fontSize: 13 }}>Dr. {completeTarget.doctorName}</p>
            </div>
          </div>
          <form onSubmit={handleComplete}>
            <div style={s.formGrid}>
              {[
                { key: 'diagnosis', label: 'Diagnosis', placeholder: 'Primary diagnosis…' },
                { key: 'treatment', label: 'Treatment', placeholder: 'Treatment plan…' },
                { key: 'prescriptions', label: 'Prescriptions', placeholder: 'Medications prescribed…' },
                { key: 'testResults', label: 'Test Results', placeholder: 'Lab / imaging results…' },
                { key: 'followUpInstructions', label: 'Follow-up Instructions', placeholder: 'Next steps for patient…' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} style={s.formGroup}>
                  <label style={s.label}>{label}</label>
                  <input placeholder={placeholder} required {...uf(key)} style={s.input} />
                </div>
              ))}
            </div>
            <div style={s.modalFooter}>
              <button type="button" style={s.cancelBtn} onClick={() => setCompleteTarget(null)}>Cancel</button>
              <button type="submit" style={{ ...s.submitBtn, background: '#16a34a' }} disabled={loading}>{loading ? 'Saving…' : 'Mark Complete'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Detail Modal */}
      {detail && (
        <Modal title={`Appointment #${detail.appointmentId}`} onClose={() => setDetail(null)}>
          <div style={s.detailTop}>
            <Avatar name={detail.patient?.firstName + ' ' + detail.patient?.lastName} size={52} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{detail.patient?.firstName} {detail.patient?.lastName}</p>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Dr. {detail.doctor?.firstName} {detail.doctor?.lastName}</p>
              <p style={{ color: '#9ca3af', fontSize: 13 }}>{detail.doctor?.specialization}</p>
            </div>
            <div style={{ marginLeft: 'auto' }}><StatusPill status={detail.status} /></div>
          </div>
          <div style={s.detailGrid}>
            <Field label="📅 Date & Time" value={detail.appointmentDateTime ? new Date(detail.appointmentDateTime).toLocaleString() : null} />
            <Field label="📝 Reason" value={detail.reasonForVisit} />
            <Field label="🔍 Diagnosis" value={detail.diagnosis} />
            <Field label="💊 Treatment" value={detail.treatment} />
            <Field label="💉 Prescriptions" value={detail.prescriptions} />
            <Field label="🧪 Test Results" value={detail.testResults} />
            <Field label="📌 Follow-up" value={detail.followUpInstructions} />
          </div>
          {detail.status === 'SCHEDULED' && (
            <div style={s.modalFooter}>
              <button style={{ ...s.submitBtn, background: '#16a34a' }} onClick={() => { setDetail(null); setCompleteTarget(detail); setUpdateForm(emptyUpdate); }}>
                Complete This Appointment
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

const s = {
  page: { padding: '28px 32px', background: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', position: 'relative' },
  toast: { position: 'fixed', top: 80, right: 24, padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: 360 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 },
  pageSubtitle: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  bookBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  toolbar: { display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' },
  searchWrap: { position: 'relative', flex: 1, minWidth: 220 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' },
  searchInput: { width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#fff', outline: 'none', boxSizing: 'border-box' },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 14px', border: '1px solid #e5e7eb', borderRadius: 20, background: '#fff', color: '#6b7280', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  filterBtnActive: { background: '#f97316', color: '#fff', borderColor: '#f97316' },
  filterCount: { background: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: '1px 7px', fontSize: 11 },
  empty: { textAlign: 'center', padding: '80px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 },
  card: { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 14 },
  cardTop: { display: 'flex', alignItems: 'center', gap: 12 },
  cardPatient: { fontWeight: 700, fontSize: 15, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardDoctor: { color: '#6b7280', fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardMeta: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  metaItem: { fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 },
  cardId: { fontSize: 12, color: '#d1d5db', fontWeight: 500 },
  cardActions: { display: 'flex', gap: 8, marginTop: 'auto' },
  actionBtn: { flex: 1, padding: '8px 0', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  actionBtnPrimary: { background: '#f97316', color: '#fff', border: 'none' },
  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 },
  modal: { background: '#fff', borderRadius: 18, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 0' },
  modalTitle: { fontWeight: 700, fontSize: 17, color: '#111827' },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9ca3af', padding: 4 },
  modalBody: { padding: '16px 24px 24px' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  formGrid: { display: 'flex', flexDirection: 'column', gap: 14 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' },
  cancelBtn: { padding: '9px 18px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  submitBtn: { padding: '9px 20px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  // Detail modal
  detailTop: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f3f4f6' },
  detailGrid: { display: 'flex', flexDirection: 'column', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 2 },
  fieldLabel: { fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' },
  fieldValue: { fontSize: 14, color: '#111827' },
  // Complete modal
  completeInfo: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0 16px', borderBottom: '1px solid #f3f4f6', marginBottom: 16 },
};
