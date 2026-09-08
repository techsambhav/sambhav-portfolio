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
      <div className="flex items-center gap-2 select-none">
        <span className="font-display text-[18px] tracking-[0.04em]" style={{ color: 'var(--text-dark)' }}>
          SAMBHAV
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#E60012',
            background: 'rgba(230,0,18,0.08)',
            border: '1px solid rgba(230,0,18,0.25)',
            padding: '2px 6px',
            borderRadius: '5px',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#E60012', display: 'inline-block' }}></span>
          STUDIO
        </span>
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
