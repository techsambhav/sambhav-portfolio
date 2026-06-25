export default function Footer() {
  return (
    <footer
      className="flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{
        background: 'var(--bg-light)',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        padding: '32px clamp(24px, 6vw, 80px)',
        transition: 'background-color 0.4s ease'
      }}
    >
      <div
        className="font-display"
        style={{ fontSize: '18px', letterSpacing: '0.04em', color: 'var(--text-dark)' }}
      >
        SAMBHAV JAIN<span style={{ color: '#E60012' }}>®</span>
      </div>
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#666666', textAlign: 'center' }}>
        © 2026 · MULTIMEDIA HEAD · BENNETT UNIVERSITY · MADE WITH RAW INTENT
      </p>
      <div
        className="font-display select-none pointer-events-none"
        style={{ fontSize: '20px', color: 'rgba(0,0,0,0.08)' }}
      >
        SJ
      </div>
    </footer>
  )
}
