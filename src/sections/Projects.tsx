import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { playUISound } from '../lib/sound'

interface ProjectItem {
  id?: string
  initials: string
  cat: string
  name: string
  desc: string
  featured: boolean
  image_url?: string
}

const defaultProjects: ProjectItem[] = [
  {
    initials: 'SB',
    cat: 'Sports Branding · Campaign',
    name: 'Sportikon BU — Brand Identity',
    desc: 'Full brand system for @sportikon_bu — logo, content templates, color palette, reel formats & merch designs. Built from scratch to 1K+ reach.',
    featured: true,
  },
  {
    initials: 'MC',
    cat: 'Merchandise · Print Design',
    name: 'Sports Merch Drop',
    desc: 'Designed hoodies, T-shirts, flags, ID cards & racket branding for Bennett Sports Committee events.',
    featured: false,
  },
  {
    initials: 'CA',
    cat: 'Startup · Platform Design',
    name: 'Connect Artist',
    desc: 'Branding, pitch deck, social media & UX strategy for artist-booker platform. Commission model. IPL & NRAI interest received.',
    featured: false,
  },
  {
    initials: 'EV',
    cat: 'Video · Event Coverage',
    name: 'Live Sports Films',
    desc: 'Shot & edited full-length event coverage films for multiple sports tournaments — highlight reels, match recaps & post-event content drops.',
    featured: false,
  },
  {
    initials: 'SP',
    cat: 'Sponsorship · Brand Deals',
    name: 'Selected Sponsorships',
    desc: 'Negotiated & closed sponsorship deals with Pepsi, Gatorade, Yonex, Nivia, Fast&Up and Vasundra Printing for campus sports events.',
    featured: false,
  },
  {
    initials: 'RL',
    cat: 'Content · Social Media',
    name: 'Reels & Campaigns',
    desc: 'Created & published 100+ reels independently across @sports_bu & @sportikon_bu. Scripting, shooting, editing, captioning — solo workflow.',
    featured: false,
  },
]

export default function Projects() {
  const [projectList, setProjectList] = useState<ProjectItem[]>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('cached_projects') : null
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch (e) {
        return defaultProjects
      }
    }
    return defaultProjects
  })
  const [wheelItems, setWheelItems] = useState<ProjectItem[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  // Track window resizing
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch projects from Supabase database
  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) throw error

        if (data) {
          const dbProjects: ProjectItem[] = data.map((item: any) => ({
            id: item.id,
            initials: item.initials || 'PR',
            cat: item.cat || 'EXPLORATION',
            name: item.name || 'Untitled Project',
            desc: item.description || '',
            featured: item.featured || false,
            image_url: item.image_url,
          }))
          setProjectList(dbProjects)
          localStorage.setItem('cached_projects', JSON.stringify(dbProjects))
        }
      } catch (err) {
        console.warn('Could not load dynamic projects from Supabase, falling back:', err)
      }
    }
    loadProjects()
  }, [])

  // Replicate list to make sure we always have enough items to form a circular 3D drum (min 6 items)
  useEffect(() => {
    if (projectList.length === 0) return
    let displayList = [...projectList]
    if (displayList.length < 6) {
      while (displayList.length < 6) {
        displayList = [...displayList, ...projectList]
      }
    }
    setWheelItems(displayList)
  }, [projectList])

  // Track sticky scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollHeight = rect.height - window.innerHeight
      if (scrollHeight <= 0) return
      
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / scrollHeight))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [wheelItems])

  // Compute active item index
  const totalSpins = 1.3
  const maxRotation = 360 * totalSpins

  useEffect(() => {
    if (wheelItems.length === 0) return
    const currentRot = scrollProgress * maxRotation
    const rawIndex = Math.round((currentRot * wheelItems.length) / 360)
    const activeIdx = ((rawIndex % wheelItems.length) + wheelItems.length) % wheelItems.length
    
    if (activeIdx !== activeIndex) {
      playUISound('swipe')
      setActiveIndex(activeIdx)
    }
  }, [scrollProgress, wheelItems, activeIndex])

  // Smooth scroll to place a specific card in front
  const scrollToCard = (index: number) => {
    if (wheelItems.length === 0) return
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const scrollHeight = rect.height - window.innerHeight
    if (scrollHeight <= 0) return

    const targetProgress = index / (wheelItems.length * totalSpins)
    const absoluteTop = window.scrollY + rect.top
    const targetScrollY = absoluteTop + targetProgress * scrollHeight

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    })
    playUISound('click')
  }

  // Get active item details
  const activeProject = wheelItems[activeIndex] || projectList[0]

  // Fine-grained proportional values for responsiveness
  let radius = 360
  let cardWidth = 320

  if (width < 480) {
    radius = 180
    cardWidth = 185
  } else if (width < 768) {
    radius = 245
    cardWidth = 230
  } else if (width < 1024) {
    radius = 300
    cardWidth = 280
  }

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative theme-dark-section"
      style={{
        background: 'var(--bg-dark)',
        height: '350vh', // Scrolling tracks
        transition: 'background-color 0.4s ease',
      }}
    >
      {/* Sticky Container */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center select-none"
        style={{
          padding: '0 clamp(24px, 6vw, 80px)',
        }}
      >
        {/* Background Grid Lines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            zIndex: 0
          }}
        />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-12 md:gap-20 items-center">
          
          {/* 1. LEFT PANEL: STAGGERED DETAILS PANEL */}
          <div className="flex flex-col justify-between h-auto md:h-[480px] py-4">
            
            {/* Header label */}
            <div>
              <div
                className="flex items-center gap-4 mb-3"
                style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: '#E60012', textTransform: 'uppercase' }}
              >
                004 — SELECTED WORK
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)', maxWidth: '40px' }}></div>
              </div>

              <h2
                className="font-display leading-[0.9] text-white tracking-tight"
                style={{ fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.02em' }}
              >
                SELECTED WORK
              </h2>
            </div>

            {/* Cross-fading description container */}
            <div className="my-8 md:my-0 min-h-[220px] flex flex-col justify-center">
              {activeProject && (
                <div 
                  key={activeIndex} 
                  className="animate-fade-in space-y-4"
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.25em',
                      color: '#E60012',
                      textTransform: 'uppercase',
                    }}
                  >
                    {activeProject.cat}
                  </div>
                  
                  <h3
                    className="font-display text-white uppercase leading-tight"
                    style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', letterSpacing: '-0.01em' }}
                  >
                    {activeProject.name}
                  </h3>
                  
                  <p
                    className="text-neutral-400 font-body text-[14px] leading-relaxed max-w-[460px]"
                  >
                    {activeProject.desc}
                  </p>
                </div>
              )}
            </div>

            {/* Scrolling index counter indicator */}
            <div className="flex items-center gap-4 text-neutral-500 font-mono text-[13px]">
              <span className="text-white font-bold">
                {String(wheelItems.length > 0 ? activeIndex + 1 : 0).padStart(2, '0')}
              </span>
              <div className="w-12 h-[1px] bg-neutral-800 relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#E60012] transition-all duration-300"
                  style={{ width: `${wheelItems.length > 0 ? ((activeIndex + 1) / wheelItems.length * 100) : 0}%` }}
                />
              </div>
              <span>{String(wheelItems.length).padStart(2, '0')}</span>
            </div>

          </div>

          {/* 2. RIGHT PANEL: 3D CYLINDRICAL CAROUSEL DRUM */}
          <div 
            className="relative w-full h-[320px] md:h-[500px] flex items-center justify-center ribbon-perspective"
          >
            <div 
              className="relative flex items-center justify-center ribbon-container-3d"
              style={{
                width: `${cardWidth}px`,
                height: `${cardWidth * 0.75}px`
              }}
            >
              {wheelItems.map((proj, idx) => {
                const totalCards = wheelItems.length
                const angleOffset = (360 / totalCards) * idx
                const currentRot = scrollProgress * maxRotation
                const cardAngle = angleOffset - currentRot
                const angleRad = (cardAngle * Math.PI) / 180
                
                // Position on Cylinder
                const y = Math.sin(angleRad) * radius
                const z = Math.cos(angleRad) * radius - radius

                const cosVal = Math.cos(angleRad)
                const opacity = cosVal < 0 ? 0.04 : Math.pow(cosVal, 1.3)
                const pointerEvents = cosVal < 0.4 ? 'none' : 'auto'
                const isActive = idx === activeIndex

                return (
                  <div
                    key={idx}
                    onClick={() => pointerEvents === 'auto' && scrollToCard(idx)}
                    onMouseEnter={() => pointerEvents === 'auto' && playUISound('hover')}
                    className="absolute inset-0 bg-neutral-900 border ribbon-item-3d group cursor-pointer"
                    style={{
                      transform: `translate3d(0, ${y}px, ${z}px) rotateX(${-cardAngle}deg) scale(${isActive ? 1.04 : 1})`,
                      opacity: opacity,
                      pointerEvents: pointerEvents,
                      zIndex: Math.round(z + radius),
                      width: `${cardWidth}px`,
                      height: `${cardWidth * 0.75}px`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      borderColor: isActive ? '#E60012' : 'rgba(255,255,255,0.06)',
                      boxShadow: isActive 
                        ? '0 25px 50px -12px rgba(230,0,18,0.25), 0 0 15px rgba(230,0,18,0.1)' 
                        : '0 20px 40px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Visual Project Image */}
                    {proj.image_url ? (
                      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center select-none">
                        <img
                          src={proj.image_url}
                          alt={proj.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      // Gradient Placeholder
                      <div 
                        className="w-full h-full flex flex-col justify-between p-6 select-none"
                        style={{
                          background: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)'
                        }}
                      >
                        <div 
                          className="font-display leading-none text-neutral-800 text-[64px] sm:text-[80px]"
                          style={{ letterSpacing: '-0.05em' }}
                        >
                          {proj.initials}
                        </div>
                        <div className="text-[10px] tracking-[0.1em] font-mono text-neutral-500 uppercase">
                          {proj.name}
                        </div>
                      </div>
                    )}

                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#E60012] z-20" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
