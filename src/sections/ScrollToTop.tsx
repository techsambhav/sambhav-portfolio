import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className="fixed flex items-center justify-center transition-all duration-300 z-50 hover:bg-white hover:text-black"
      style={{
        bottom: '32px',
        right: '32px',
        width: '44px',
        height: '44px',
        background: '#E60012',
        color: '#FFFFFF',
        fontSize: '20px',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      ↑
    </a>
  )
}
