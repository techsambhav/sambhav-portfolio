import { useEffect, useRef } from 'react'
import { playUISound } from '../lib/sound'

const experiences = [
  {
    date: '2025-2026',
    org: 'Sports Committee\nBennett University',
    loc: 'Greater Noida, UP',
    title: 'Multimedia Head',
    bullets: [
      'Lead sports marketing & manage <strong>@sports_bu / @sportikon_bu</strong> independently',
      'Create & publish <strong>reels, posts, and full campaigns</strong> solo — end to end',
      'Design <strong>merchandise & creatives</strong> — banners, hoodies, T-shirts, ID cards, flags, rackets',
      'Handle <strong>vendor coordination & sponsorship deals</strong> — Pepsi, Gatorade, Yonex, Nivia, Fast&Up, Vasundra Printing',
      'Lead <strong>media team</strong> & manage complete event coverage',
      'Execute <strong>visual storytelling & coverage</strong> for all sports under Sportikon BU (including Cricket, Football, Basketball, Badminton, Table Tennis, Lawn Tennis, Volleyball, Kabaddi, Squash, Athletics, Chess, and Esports)',
    ],
  },
  {
    date: '2025 - Present',
    org: 'Connect Artist\nEarly Stage Startup',
    loc: 'India',
    title: 'Founder',
    bullets: [
      'Building a <strong>platform connecting local artists</strong> with event organizers',
      'Artists can register, <strong>showcase portfolios</strong> & get booked directly',
      'Working on a <strong>commission-based model</strong> — artist side + organizer side',
      'Handling <strong>branding, strategy & execution</strong> completely in-house',
      'Received opportunities from <strong>IPL broadcasting & NRAI Shooting</strong>',
      'Managing <strong>social media & content strategy</strong> for platform growth',
    ],
  },
  {
    date: '2025 - Present',
    org: 'Geo Motor India',
    loc: 'India',
    title: 'Content Creator & Media Designer',
    bullets: [
      'Produced high-impact <strong>promotional video campaigns</strong> and digital assets for brand marketing',
      'Designed <strong>social media creatives, catalogs, and brochures</strong> to showcase automotive features',
      'Optimized <strong>brand assets</strong> for print and digital channels, maintaining design consistency',
    ],
  },
  {
    date: '2025-2026',
    org: 'Times Now · Esports\nCommunities',
    loc: 'India',
    title: 'Network & Collaboration',
    bullets: [
      'Connected with <strong>Times Now</strong> for media and collaboration exposure',
      'Active in <strong>Esports communities</strong> for content & sponsorship networks',
      'Actively contributing to <strong>real-world marketing, sponsorship handling</strong>',
    ],
  },
]

export default function Work() {
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
      id="work"
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
          003 — EXPERIENCE
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
          WHERE I'VE WORKED
        </h2>

        {/* Experience list */}
        <div className="flex flex-col">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="rv grid grid-cols-1 md:grid-cols-[260px_1fr] transition-all duration-300"
              style={{
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(0,0,0,0.015)',
                marginBottom: '-1px',
              }}
              onMouseEnter={() => playUISound('hover')}
            >
              {/* Left */}
              <div
                className="p-8"
                style={{ borderRight: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}
              >
                <div
                  className="mb-2 font-mono"
                  style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: '#E60012' }}
                >
                  {exp.date}
                </div>
                <div
                  className="font-['Bebas_Neue'] mb-1.5"
                  style={{
                    fontSize: 'clamp(24px, 3vw, 30px)',
                    color: 'var(--text-dark)',
                    lineHeight: 1.15,
                    whiteSpace: 'pre-line',
                    letterSpacing: '0.01em',
                  }}
                >
                  {exp.org}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#666666' }}>
                  {exp.loc}
                </div>
              </div>

              {/* Right */}
              <div className="p-8">
                <div
                  className="font-['Bebas_Neue'] mb-4"
                  style={{
                    fontSize: 'clamp(24px, 3vw, 30px)',
                    color: 'var(--text-dark)',
                    letterSpacing: '0.03em',
                  }}
                >
                  {exp.title}
                </div>
                <ul className="flex flex-col gap-2.5 list-none">
                  {exp.bullets.map((bullet, bidx) => (
                    <li
                      key={bidx}
                      className="flex gap-3"
                      style={{ fontSize: '14px', color: '#555555', lineHeight: 1.7 }}
                    >
                      <span style={{ color: '#E60012', flexShrink: 0, marginTop: '1.5px' }}>→</span>
                      <span
                        dangerouslySetInnerHTML={{ __html: bullet }}
                        style={{
                          WebkitFontSmoothing: 'antialiased'
                        }}
                      ></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
