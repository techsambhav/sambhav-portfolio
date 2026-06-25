import { useEffect, useRef } from 'react'
import { playUISound } from '../lib/sound'

const tags = [
  { label: 'Bennett University', hot: true },
  { label: 'Sports Committee', hot: true },
  { label: 'Connect Artist', hot: true },
  { label: 'Jain Traders', hot: false },
  { label: 'InAmigos', hot: false },
  { label: 'Full Stack Dev', hot: false },
  { label: 'Multimedia Head', hot: false },
]

const profileRows = [
  { key: 'ROLE', val: 'Multimedia Head — Sports Committee' },
  { key: 'STARTUP', val: 'Founder — Connect Artist' },
  { key: 'PROJECTS', val: 'Jain Traders · 1000+ Creatives' },
  { key: 'INTERNSHIP', val: 'Creative & Social Media — InAmigos' },
  { key: 'COLLEGE', val: 'Bennett University (B.Tech CSE)' },
  { key: 'BRANDS', val: 'Pepsi · Gatorade · Yonex · Nivia' },
  { key: 'EMAIL', val: 'working.sambhav24@gmail.com' },
]

export default function About() {
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
      id="about"
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
          001 — ABOUT
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
          THE STORY
        </h2>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 md:gap-20">
          {/* Left — Bio */}
          <div className="rv space-y-6">
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-dark)', fontWeight: 500 }}>
              Hi, I’m <strong style={{ color: 'var(--text-dark)', fontWeight: 700 }}>Sambhav Jain</strong> — a B.Tech Computer Science student at Bennett University and a multidisciplinary creator passionate about bridging technology, design, and entrepreneurship.
            </p>

            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555555' }}>
              I served as the <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Multimedia Head of the Sports Committee</strong> at Bennett University. In this role, I lead creative campaigns, social media strategy, event branding, and content production. I have built a track record of creating <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>1000+ visual creatives</strong>, managing multiple social media channels, coordinating with sponsors, and delivering brand campaigns for names like <strong style={{ color: '#E60012', fontWeight: 600 }}>Pepsi, Gatorade, Yonex, Fast&amp;Up, and Nivia</strong>.
            </p>

            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555555' }}>
              Alongside my creative work, I am a <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Full Stack Developer</strong>. I enjoy building functional, real-world platforms, such as the <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Jain Traders School Dress platform</strong> (a digital commerce solution built for my family's business) alongside several other web applications focused on solving everyday structural problems.
            </p>

            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555555' }}>
              I am also the Founder of <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Connect Artist</strong> — an early-stage startup connecting local performance artists directly with event organizers through a technology-driven commission platform.
            </p>

            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555555' }}>
              Further expanding my experience, I have contributed to creative and social media initiatives through collaborations and internships, including my time at <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>InAmigos</strong>.
            </p>

            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#555555' }}>
              My skillset brings together <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Full Stack Engineering, UI/UX Design, Graphic Design, Video Editing, Social Media Marketing, and Brand Strategy</strong>. I thrive on translating ideas into solid code and visuals that create real impact. I believe in continuous building, experimenting, and learning to create products that bridge technology and aesthetics.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {tags.map((tag) => (
                <span
                  key={tag.label}
                  className="transition-all duration-250 cursor-crosshair select-none"
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    border: `1px solid ${tag.hot ? '#E60012' : 'rgba(0,0,0,0.1)'}`,
                    background: tag.hot ? 'rgba(230,0,18,0.04)' : 'rgba(0,0,0,0.02)',
                    color: tag.hot ? '#E60012' : '#666666',
                  }}
                  onMouseEnter={(e) => {
                    playUISound('hover')
                    e.currentTarget.style.borderColor = '#E60012'
                    e.currentTarget.style.color = '#E60012'
                    e.currentTarget.style.background = 'rgba(230,0,18,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = tag.hot ? '#E60012' : 'rgba(0,0,0,0.1)'
                    e.currentTarget.style.color = tag.hot ? '#E60012' : '#666666'
                    e.currentTarget.style.background = tag.hot ? 'rgba(230,0,18,0.04)' : 'rgba(0,0,0,0.02)'
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Profile Card */}
          <div
            className="rv relative overflow-hidden h-fit"
            style={{
              border: '1px solid rgba(0,0,0,0.1)',
              background: '#D9D9D9',
              padding: '36px 32px',
              borderRadius: '16px',
            }}
          >
            {/* Watermark */}
            <div
              className="font-display absolute pointer-events-none select-none"
              style={{
                fontSize: 'clamp(60px, 8vw, 110px)',
                color: 'rgba(0,0,0,0.025)',
                bottom: '-12px',
                right: '10px',
                lineHeight: 1,
              }}
            >
              SAMBHAV
            </div>

            <div
              className="mb-6 pb-4"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#E60012',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              Quick Profile
            </div>

            {profileRows.map((row) => (
              <div
                key={row.key}
                className="flex justify-between py-3.5"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#666666', minWidth: '90px' }}>
                  {row.key}
                </span>
                <span
                  className="text-right font-medium"
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-dark)',
                    maxWidth: '220px',
                    lineHeight: 1.5,
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
