export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.dialog} onClick={e => e.stopPropagation()}>
        <div style={s.title}>{title}</div>
        <div style={s.message}>{message}</div>
        <div style={s.divider} />
        <div style={s.actions}>
          <button style={s.btnCancel} onClick={onCancel}>Cancel</button>
          <div style={s.vDivider} />
          <button style={s.btnDelete} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
    backdropFilter: 'blur(4px)',
  },
  dialog: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '14px',
    width: '270px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    textAlign: 'center',
  },
  title: {
    padding: '20px 16px 4px',
    fontSize: '17px', fontWeight: '600', color: '#1a1a1a',
    letterSpacing: '-0.2px',
  },
  message: {
    padding: '4px 16px 20px',
    fontSize: '13px', color: '#6b7280', lineHeight: '1.4',
  },
  divider: { height: '1px', background: '#e5e7eb' },
  actions: { display: 'flex', height: '44px' },
  vDivider: { width: '1px', background: '#e5e7eb', flexShrink: 0 },
  btnCancel: {
    flex: 1, border: 'none', background: 'none',
    fontSize: '17px', fontWeight: '400', color: '#1a73e8', cursor: 'pointer',
  },
  btnDelete: {
    flex: 1, border: 'none', background: 'none',
    fontSize: '17px', fontWeight: '600', color: '#ef4444', cursor: 'pointer',
  },
};
