import { useEffect } from 'react'
import { useLocation } from 'react-router'
import Navigation from '../sections/Navigation'
import Hero from '../sections/Hero'
import Marquee from '../sections/Marquee'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Work from '../sections/Work'
import Projects from '../sections/Projects'
import Vendors from '../sections/Vendors'
import MediaGallery from '../sections/MediaGallery'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'
import ScrollToTop from '../sections/ScrollToTop'

export default function Portfolio() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const target = location.hash
      const el = document.querySelector(target)
      if (el) {
        // Delay scroll slightly to ensure page rendering is complete
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.key]) // Re-run when navigation key changes (triggers on hash navigations too)

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', transition: 'background-color 0.4s ease' }}>
      <Navigation />
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Work />
      <Projects />
      <Vendors />
      <MediaGallery />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
