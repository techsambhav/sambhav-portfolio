import { useEffect, useRef } from 'react'
import { playUISound } from '../lib/sound'

const vendors = [
  { name: 'PEPSI', type: 'Beverage · Sponsor' },
  { name: 'GATORADE', type: 'Sports Nutrition' },
  { name: 'YONEX', type: 'Sports Equipment' },
  { name: 'NIVIA', type: 'Sports Gear' },
  { name: 'FAST&UP', type: 'Health Supplement' },
  { name: 'VASUNDRA', type: 'Print · Merch' },
]

export default function Vendors() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    const els = sectionRef.current?.querySelectorAll('.rv')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="vendors"
      ref={sectionRef}
      style={{
        background: 'var(--bg-light)',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)',
        transition: 'background-color 0.4s ease'
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {/* Section label */}
        <div
          className="flex items-center gap-4 mb-3"
          style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#E60012', textTransform: 'uppercase' }}
        >
          005 — BRAND PARTNERS
          <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.15)', maxWidth: '50px' }}></div>
        </div>

        {/* Heading */}
        <h2
          className="font-display mb-16"
          style={{
            fontSize: 'clamp(44px, 6vw, 88px)',
            lineHeight: 0.9,
            color: 'var(--text-dark)',
            letterSpacing: '-0.02em',
          }}
        >
          WORKED WITH
        </h2>

        {/* Vendor grid */}
        <div
          className="rv grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          style={{ gap: '1px', background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}
        >
          {vendors.map((vendor) => (
            <div
              key={vendor.name}
              className="flex flex-col items-center justify-center gap-3 transition-colors duration-250"
              style={{
                background: 'var(--bg-light)',
                padding: '36px 16px',
                cursor: 'crosshair',
              }}
              onMouseEnter={(e) => {
                playUISound('hover')
                e.currentTarget.style.background = 'rgba(0,0,0,0.03)'
                const logo = e.currentTarget.querySelector('.vendor-logo') as HTMLElement
                if (logo) logo.style.color = 'var(--text-dark)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-light)'
                const logo = e.currentTarget.querySelector('.vendor-logo') as HTMLElement
                if (logo) logo.style.color = '#7A7A7A'
              }}
            >
              <div
                className="vendor-logo font-['Bebas_Neue'] text-center transition-colors duration-200"
                style={{
                  fontSize: 'clamp(20px, 2vw, 26px)',
                  letterSpacing: '0.08em',
                  color: '#666666',
                }}
              >
                {vendor.name}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#888888',
                }}
              >
                {vendor.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
