import { useEffect, useRef, useState } from 'react'
import { playUISound } from '../lib/sound'
import { supabase } from '../lib/supabase'

const contactInfo = [
  { key: 'PHONE', val: '+91 7037936440', href: 'tel:+917037936440' },
  { key: 'EMAIL', val: 'working.sambhav24@gmail.com', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=working.sambhav24@gmail.com' },
  { key: 'INSTA (PERSONAL)', val: '@tech_sambhav', href: 'https://www.instagram.com/tech_sambhav/' },
  { key: 'INSTA (SPORTS BU)', val: '@sports_bu', href: 'https://www.instagram.com/sports_bu/' },
  { key: 'INSTA (SPORTIKON)', val: '@sportikon_bu', href: 'https://www.instagram.com/sportikon_bu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
  { key: 'INSTA (GEO MOTOR)', val: '@geomotorindia', href: 'https://www.instagram.com/geomotorindia/' },
  { key: 'LINKEDIN', val: 'Sambhav Jain', href: 'https://www.linkedin.com/in/sambhav-jain-s24cseu1216/' },
  { key: 'LOCATION', val: 'Bennett University, Greater Noida\nAvailable Pan India', href: null },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playUISound('click')
    setLoading(true)

    try {
      // 1. Save submission to Supabase
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          service: formData.service || 'General Inquiry',
          message: formData.message,
          created_at: new Date().toISOString()
        }
      ])

      if (error) {
        console.warn('Supabase insert notice (falling back to direct mail):', error.message)
      }
    } catch (err) {
      console.warn('Error sending to database:', err)
    }

    // 2. Open Gmail / Mail client prefilled as a direct fallback
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name} [${formData.service || 'General'}]`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail/Phone: ${formData.email}\nService needed: ${formData.service || 'Not specified'}\n\nMessage:\n${formData.message}`
    )
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=working.sambhav24@gmail.com&su=${subject}&body=${body}`
    window.open(mailtoUrl, '_blank')

    setLoading(false)
    setSent(true)
    setFormData({ name: '', email: '', service: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section
      id="contact"
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
          006 — CONTACT
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
          LET'S BUILD
        </h2>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16 md:gap-20">
          {/* Left — Info */}
          <div className="rv">
            <p className="mb-10" style={{ fontSize: '15px', color: '#555555', lineHeight: 1.7 }}>
              Looking for a <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>creative partner</strong> who can design, shoot, edit, AND close the sponsorship deal? That's me.
            </p>

            <div className="flex flex-col gap-6">
              {contactInfo.map((info) => (
                <div key={info.key} className="flex gap-4 items-start">
                  <span
                    className="mt-0.5 shrink-0"
                    style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#E60012', textTransform: 'uppercase', minWidth: '80px' }}
                  >
                    {info.key}
                  </span>
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      onMouseEnter={() => playUISound('hover')}
                      className="transition-colors duration-250 hover:text-[#E60012] font-medium"
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-dark)',
                        lineHeight: 1.6,
                        textDecoration: 'none',
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {info.val}
                    </a>
                  ) : (
                    <span style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 500, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {info.val}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <form className="rv flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#666666', textTransform: 'uppercase' }}>
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Sambhav Jain"
                className="w-full bg-transparent text-neutral-800 outline-none transition-colors duration-200 focus:border-b-[#E60012]"
                style={{
                  border: 'none',
                  borderBottom: '1px solid rgba(0,0,0,0.12)',
                  padding: '12px 0',
                  fontSize: '14px',
                  fontFamily: "'Space Mono', monospace",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#666666', textTransform: 'uppercase' }}>
                Email / Phone
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="working.sambhav24@gmail.com"
                className="w-full bg-transparent text-neutral-800 outline-none transition-colors duration-200 focus:border-b-[#E60012]"
                style={{
                  border: 'none',
                  borderBottom: '1px solid rgba(0,0,0,0.12)',
                  padding: '12px 0',
                  fontSize: '14px',
                  fontFamily: "'Space Mono', monospace",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#666666', textTransform: 'uppercase' }}>
                What do you need?
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-transparent text-neutral-800 outline-none cursor-crosshair transition-colors duration-200 focus:border-b-[#E60012]"
                style={{
                  border: 'none',
                  borderBottom: '1px solid rgba(0,0,0,0.12)',
                  padding: '12px 0',
                  fontSize: '14px',
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                <option value="" style={{ background: '#D9D9D9', color: '#1C1C1C' }}>Select...</option>
                <option value="Graphic Design" style={{ background: '#D9D9D9', color: '#1C1C1C' }}>Graphic Design</option>
                <option value="Video Editing" style={{ background: '#D9D9D9', color: '#1C1C1C' }}>Video Editing</option>
                <option value="Brand Deal" style={{ background: '#D9D9D9', color: '#1C1C1C' }}>Brand Deal</option>
                <option value="Other" style={{ background: '#D9D9D9', color: '#1C1C1C' }}>Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#666666', textTransform: 'uppercase' }}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell me about the project..."
                rows={4}
                className="w-full bg-transparent text-neutral-800 outline-none transition-colors duration-200 focus:border-[#E60012]"
                style={{
                  border: '1px solid rgba(0,0,0,0.12)',
                  padding: '12px',
                  fontSize: '14px',
                  fontFamily: "'Space Mono', monospace",
                  resize: 'vertical',
                  minHeight: '100px',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => playUISound('hover')}
              className="self-start transition-all duration-300 hover:bg-neutral-800 hover:text-white mt-2 select-none cursor-crosshair font-mono disabled:opacity-50"
              style={{
                background: sent ? 'transparent' : '#1C1C1C',
                color: sent ? '#E60012' : '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '14px 36px',
                borderRadius: '24px',
                border: sent ? '1px solid #E60012' : 'none',
              }}
            >
              {loading ? 'SENDING...' : sent ? '✓ SENT' : 'SEND MESSAGE →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
