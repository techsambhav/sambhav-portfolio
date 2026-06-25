import { useEffect, useRef } from 'react'
import { playUISound } from '../lib/sound'

const skills = [
  { num: '01', name: 'Graphic Design', tools: 'Photoshop · Illustrator · Canva\nBanners · Merch · ID Cards · Flags · Posters', width: 92 },
  { num: '02', name: 'Video Editing', tools: 'Premiere Pro · CapCut · After Effects\nReels · Highlights · Event Films', width: 88 },
  { num: '03', name: 'Sports Marketing', tools: 'Campaign Strategy · Social Media\nInstagram · Content Planning · Reels', width: 85 },
  { num: '04', name: 'Vendor & Sponsorship', tools: 'Brand Outreach · Negotiation\nPepsi · Gatorade · Yonex · Nivia · Fast&Up', width: 80 },
  { num: '05', name: 'Content Direction', tools: 'Visual Storytelling · Shot Planning\nLive Event Coverage · Brand Voice', width: 83 },
  { num: '06', name: 'Team Leadership', tools: 'Media Team Management\nDelegation · Workflow · Deadlines', width: 78 },
  { num: '07', name: 'AI Tools', tools: 'Midjourney · ChatGPT · AI Editing\nCreative Tech Integration', width: 72 },
  { num: '08', name: 'Web Development', tools: 'HTML · CSS · JS (Learning)\nPortfolio Sites · UI Basics', width: 65 },
]

export default function Skills() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target.querySelector('.sk-fill') as HTMLElement
            if (fill) {
              const width = entry.target.getAttribute('data-width') || '80'
              fill.style.width = width + '%'
            }
            entry.target.classList.add('vis')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )

    const els = gridRef.current?.querySelectorAll('.sk')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      className="theme-dark-section"
      style={{
        background: 'var(--bg-dark)',
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
          002 — SKILLS
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)', maxWidth: '50px' }}></div>
        </div>

        {/* Heading */}
        <h2
          className="font-display mb-16"
          style={{
            fontSize: 'clamp(44px, 6vw, 88px)',
            lineHeight: 0.9,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          WHAT I DO
        </h2>

        {/* Skills grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '1px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {skills.map((skill) => (
            <div
              key={skill.num}
              className="sk rv relative overflow-hidden transition-all duration-300"
              data-width={skill.width}
              style={{
                background: 'var(--bg-dark)',
                padding: '36px 28px',
                cursor: 'crosshair',
              }}
              onMouseEnter={(e) => {
                playUISound('hover')
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                const num = e.currentTarget.querySelector('.sk-num') as HTMLElement
                if (num) num.style.color = 'rgba(230, 0, 18, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-dark)'
                const num = e.currentTarget.querySelector('.sk-num') as HTMLElement
                if (num) num.style.color = '#1A1A1A'
              }}
            >
              {/* Large number */}
              <div
                className="sk-num font-['Bebas_Neue'] absolute top-2 right-4 pointer-events-none transition-colors duration-300"
                style={{
                  fontSize: 'clamp(48px, 6vw, 75px)',
                  color: '#1E1E1E',
                  lineHeight: 1,
                }}
              >
                {skill.num}
              </div>

              {/* Skill name */}
              <h3
                className="font-['Bebas_Neue'] mb-3 relative"
                style={{
                  fontSize: 'clamp(26px, 3vw, 36px)',
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                }}
              >
                {skill.name}
              </h3>

              {/* Tools */}
              <p
                className="relative text-neutral-400"
                style={{
                  fontSize: '12px',
                  lineHeight: 1.8,
                  letterSpacing: '0.08em',
                  whiteSpace: 'pre-line',
                }}
              >
                {skill.tools}
              </p>

              {/* Progress bar */}
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '24px' }}>
                <div className="sk-fill"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
