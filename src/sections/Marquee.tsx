const items = [
  'Graphic Design',
  'Video Editing',
  'Sports Marketing',
  'Brand Strategy',
  'Reel Creation',
  'Vendor Deals',
  'Event Coverage',
  'Content Direction',
  'Merchandise Design',
  'Social Media Growth',
]

export default function Marquee() {
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden theme-dark-section"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '16px 0',
        background: 'var(--bg-dark)',
        transition: 'background-color 0.4s ease'
      }}
    >
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{
          animation: 'marquee 22s linear infinite',
          width: 'max-content',
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-mono tracking-[0.15em] uppercase"
            style={{ fontSize: '12px', fontWeight: 700, color: '#A0A0A0' }}
          >
            {item}
            <span style={{ fontSize: '6px', color: '#E60012' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
