import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { playUISound } from '../lib/sound'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    playUISound('click')
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/' + id)
    } else {
      const el = document.querySelector(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const toggleMenu = () => {
    playUISound('click')
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-400"
        style={{
          height: scrolled ? '75px' : '90px',
          padding: '0 clamp(24px, 6vw, 80px)',
          background: menuOpen 
            ? 'transparent' 
            : scrolled 
              ? 'rgba(210, 210, 210, 0.85)' 
              : 'transparent',
          backdropFilter: !menuOpen && scrolled ? 'blur(12px)' : 'none',
          borderBottom: !menuOpen && scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          onMouseEnter={() => playUISound('hover')}
          className="font-display text-[22px] tracking-[0.06em] no-underline flex items-center gap-0.5 select-none transition-colors duration-300"
          style={{ 
            color: menuOpen ? '#FFFFFF' : '#1C1C1C' 
          }}
        >
          SAMBHAV<span style={{ color: '#E60012' }}>®</span>
        </a>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Let's Talk CTA */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=working.sambhav24@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playUISound('hover')}
            onClick={() => playUISound('click')}
            className="hidden sm:inline-block text-[12px] font-bold tracking-[0.1em] uppercase no-underline px-6 py-3.5 transition-all duration-300 select-none cursor-crosshair"
            style={{ 
              borderRadius: '24px',
              background: menuOpen ? '#FFFFFF' : '#1C1C1C', 
              color: menuOpen ? '#1C1C1C' : '#FFFFFF' 
            }}
          >
            LET'S TALK
          </a>

          {/* Menu Button (Pill shaped) */}
          <button
            onClick={toggleMenu}
            onMouseEnter={() => playUISound('hover')}
            className="flex items-center gap-3 text-[12px] font-bold tracking-[0.1em] uppercase px-5 py-3 transition-all duration-300 border cursor-crosshair select-none"
            style={{
              borderRadius: '24px',
              background: menuOpen ? '#FFFFFF' : 'transparent',
              color: menuOpen ? '#1C1C1C' : '#1C1C1C',
              borderColor: menuOpen ? '#FFFFFF' : '#1C1C1C',
            }}
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
            {menuOpen ? (
              <span className="text-[14px]">×</span>
            ) : (
              <div className="flex flex-col gap-[3px] w-4">
                <span className="block h-[1.5px] w-full bg-current"></span>
                <span className="block h-[1.5px] w-3/4 align-right bg-current"></span>
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <div
        className={`fixed inset-0 z-[90] flex flex-col justify-between transition-all duration-600 ease-in-out ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: '#0E0E0E',
          padding: '140px clamp(24px, 6vw, 80px) 60px',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* Navigation list */}
        <div className="flex flex-col gap-6 my-auto">
          {[
            { label: 'HOME', target: '#home' },
            { label: 'ABOUT', target: '#about' },
            { label: 'WORK & PROJECTS', target: '#projects' },
            { label: 'VISUAL GALLERY', target: '#media' },
            { label: 'CONTACT', target: '#contact' },
          ].map((item, index) => (
            <div 
              key={item.label}
              className="overflow-hidden"
            >
              <a
                href={item.target}
                onClick={(e) => handleNavClick(e, item.target)}
                onMouseEnter={() => playUISound('hover')}
                className={`font-display inline-block no-underline tracking-tighter uppercase transition-transform duration-500 hover:text-[#E60012] ${
                  menuOpen ? 'translate-y-0' : 'translate-y-[120%]'
                }`}
                style={{
                  fontSize: 'clamp(36px, 7vw, 80px)',
                  lineHeight: 1.1,
                  color: '#FFFFFF',
                  transitionDelay: `${index * 0.08}s`,
                }}
              >
                {item.label}
              </a>
            </div>
          ))}
        </div>

        {/* Footer of full-screen menu */}
        <div 
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-neutral-800 pt-8 transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          {/* Quick info */}
          <div>
            <div className="text-[11px] tracking-[0.2em] text-neutral-500 uppercase mb-2">Based in</div>
            <div className="text-[13px] text-neutral-300 font-mono">Greater Noida, India</div>
          </div>

          {/* Social connections */}
          <div className="flex gap-8">
            {[
              { name: 'INSTA (PERSONAL)', url: 'https://www.instagram.com/tech_sambhav/' },
              { name: 'INSTA (SPORTS BU)', url: 'https://www.instagram.com/sports_bu/' },
              { name: 'INSTA (SPORTIKON)', url: 'https://www.instagram.com/sportikon_bu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'INSTA (GEO MOTOR)', url: 'https://www.instagram.com/geomotorindia/' },
              { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/sambhav-jain-s24cseu1216/' },
              { name: 'EMAIL', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=working.sambhav24@gmail.com' }
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => playUISound('hover')}
                className="text-[12px] font-bold tracking-[0.15em] text-neutral-400 no-underline hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
