import { useEffect, useState } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../api/api';

const empty = { firstName: '', lastName: '', dateOfBirth: '', gender: '', address: '', phoneNumber: '', email: '', emergencyContact: '' };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => getPatients().then(r => setPatients(r.data)).catch(() => setError('Failed to load patients'));
  useEffect(() => { load(); }, []);

  const openRegister = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ firstName: p.firstName, lastName: p.lastName, dateOfBirth: p.dateOfBirth, gender: p.gender, address: p.address, phoneNumber: p.phoneNumber, email: p.email, emergencyContact: p.emergencyContact });
    setEditId(p.patientId);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updatePatient(editId, form);
        // refresh selected if viewing this patient
        if (selected?.patientId === editId) setSelected({ ...selected, ...form });
      } else {
        await createPatient(form);
      }
      closeForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    await deletePatient(id);
    if (selected?.patientId === id) setSelected(null);
    load();
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm(prev => ({ ...prev, [k]: e.target.value })) });

  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      {/* Modal Form */}
      {showForm && (
        <div style={s.overlay} onClick={closeForm}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>{editId ? '✏️ Edit Patient' : '➕ Register New Patient'}</span>
              <button style={s.closeBtn} onClick={closeForm}>✕</button>
            </div>
            {error && <div style={s.errorBox}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={s.grid}>
                <input placeholder="First Name" required {...f('firstName')} style={s.input} />
                <input placeholder="Last Name" required {...f('lastName')} style={s.input} />
                <input type="date" required {...f('dateOfBirth')} style={s.input} />
                <select required {...f('gender')} style={s.input}>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input placeholder="Phone Number e.g. +91-98765 43210" required pattern="^[0-9+\-() ]{1,20}$" title="1–20 chars: digits, +, -, (, ), spaces" {...f('phoneNumber')} style={s.input} />
                <input placeholder="Email" type="email" required {...f('email')} style={s.input} />
                <input placeholder="Address" {...f('address')} style={{ ...s.input, gridColumn: 'span 2' }} />
                <input placeholder="Emergency Contact" {...f('emergencyContact')} style={{ ...s.input, gridColumn: 'span 2' }} />
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.btnCancel} onClick={closeForm}>Cancel</button>
                <button type="submit" style={s.btnPrimary}>{editId ? 'Update Patient' : 'Register Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={s.layout}>
        {/* LEFT: Patient List */}
        <div style={s.listPanel}>
          <div style={s.listHeader}>
            <span style={s.listTitle}>Patients <span style={s.count}>{filtered.length}</span></span>
            <button style={s.btnPrimary} onClick={openRegister}>+ Register</button>
          </div>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchBox}
          />
          <div style={s.patientList}>
            {filtered.length === 0 && <p style={s.empty}>No patients found</p>}
            {filtered.map(p => (
              <div
                key={p.patientId}
                style={{ ...s.patientRow, ...(selected?.patientId === p.patientId ? s.patientRowActive : {}) }}
                onClick={() => setSelected(p)}
              >
                <div style={s.avatar}>{p.firstName?.[0]}{p.lastName?.[0]}</div>
                <div style={s.rowInfo}>
                  <div style={s.rowName}>{p.firstName} {p.lastName}</div>
                  <div style={s.rowSub}>{p.gender} · {p.phoneNumber}</div>
                </div>
                <span style={s.chevron}>›</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Patient Detail */}
        <div style={s.detailPanel}>
          {!selected ? (
            <div style={s.emptyDetail}>
              <span style={s.emptyIcon}>👤</span>
              <p style={s.emptyText}>Select a patient to view their details</p>
            </div>
          ) : (
            <div style={s.profileCard}>
              {/* Profile Header */}
              <div style={s.profileHeader}>
                <div style={s.profileAvatar}>
                  {selected.firstName?.[0]}{selected.lastName?.[0]}
                </div>
                <div>
                  <div style={s.profileName}>{selected.firstName} {selected.lastName}</div>
                  <div style={s.profileId}>Patient ID: #{selected.patientId}</div>
                  <span style={s.genderBadge}>{selected.gender}</span>
                </div>
                <div style={s.profileActions}>
                  <button style={s.btnEdit} onClick={() => openEdit(selected)}>✏️ Edit</button>
                  <button style={s.btnDelete} onClick={() => handleDelete(selected.patientId)}>🗑️ Delete</button>
                </div>
              </div>

              {/* Info Sections */}
              <div style={s.infoGrid}>
                <InfoBlock label="Date of Birth" value={selected.dateOfBirth} icon="🎂" />
                <InfoBlock label="Phone Number" value={selected.phoneNumber} icon="📞" />
                <InfoBlock label="Email Address" value={selected.email} icon="✉️" />
                <InfoBlock label="Emergency Contact" value={selected.emergencyContact || '—'} icon="🚨" />
                <InfoBlock label="Address" value={selected.address || '—'} icon="📍" wide />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, icon, wide }) {
  return (
    <div style={{ ...s.infoBlock, ...(wide ? s.infoBlockWide : {}) }}>
      <div style={s.infoIcon}>{icon}</div>
      <div>
        <div style={s.infoLabel}>{label}</div>
        <div style={s.infoValue}>{value}</div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '28px 32px', background: '#f3f4f6', minHeight: '100vh' },

  // Modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  modal: {
    background: '#fff', borderRadius: '14px', padding: '28px',
    width: '560px', maxWidth: '95vw', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { fontSize: '17px', fontWeight: '700', color: '#1a1a1a' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888', padding: '0 4px' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  errorBox: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' },

  // Layout
  layout: { display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' },

  // List Panel
  listPanel: {
    width: '320px', flexShrink: 0, background: '#fff',
    borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  listHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 16px 12px',
  },
  listTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a1a' },
  count: {
    background: '#f3f4f6', color: '#6b7280', borderRadius: '20px',
    padding: '1px 8px', fontSize: '12px', fontWeight: '600', marginLeft: '6px',
  },
  searchBox: {
    margin: '0 16px 12px', padding: '8px 12px', borderRadius: '8px',
    border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none',
  },
  patientList: { flex: 1, overflowY: 'auto' },
  patientRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6',
    transition: 'background 0.15s',
  },
  patientRowActive: { background: '#fff7ed', borderLeft: '3px solid #f97316' },
  avatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: '#f97316', color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px', flexShrink: 0,
  },
  rowInfo: { flex: 1, minWidth: 0 },
  rowName: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  rowSub: { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  chevron: { color: '#d1d5db', fontSize: '20px', fontWeight: '300' },
  empty: { textAlign: 'center', color: '#9ca3af', padding: '32px 16px', fontSize: '14px' },

  // Detail Panel
  detailPanel: {
    flex: 1, background: '#fff', borderRadius: '14px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'auto',
  },
  emptyDetail: {
    height: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '12px',
  },
  emptyIcon: { fontSize: '56px', opacity: 0.3 },
  emptyText: { color: '#9ca3af', fontSize: '15px' },

  // Profile Card
  profileCard: { padding: '28px' },
  profileHeader: {
    display: 'flex', alignItems: 'center', gap: '20px',
    paddingBottom: '24px', borderBottom: '1px solid #f3f4f6', marginBottom: '24px',
  },
  profileAvatar: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', fontSize: '24px', flexShrink: 0,
  },
  profileName: { fontSize: '22px', fontWeight: '800', color: '#1a1a1a', marginBottom: '4px' },
  profileId: { fontSize: '13px', color: '#9ca3af', marginBottom: '8px' },
  genderBadge: {
    background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
    borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600',
  },
  profileActions: { marginLeft: 'auto', display: 'flex', gap: '10px' },

  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
  },
  infoBlock: {
    display: 'flex', alignItems: 'flex-start', gap: '14px',
    background: '#f9fafb', borderRadius: '10px', padding: '16px',
  },
  infoBlockWide: { gridColumn: 'span 2' },
  infoIcon: { fontSize: '22px', marginTop: '2px' },
  infoLabel: { fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' },
  infoValue: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a' },

  // Buttons
  btnPrimary: { padding: '8px 18px', background: '#f97316', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
  btnCancel: { padding: '8px 18px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
  btnEdit: { padding: '7px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
  btnDelete: { padding: '7px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
};
