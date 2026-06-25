import { useEffect, useRef, useState } from 'react'
import { playUISound } from '../lib/sound'
import { supabase } from '../lib/supabase'

interface CardItem {
  title: string
  cat: string
  image: string
  type: 'image' | 'video'
  targetId: string
}

const defaultCards: CardItem[] = [
  { title: 'Sportikon BU', cat: 'SPORTS BRANDING', image: '/images/sportikon-brand.jpg', type: 'image', targetId: '#projects' },
  { title: 'Sports Merch Drop', cat: 'MERCH DESIGN', image: '/images/merch-collection.jpg', type: 'image', targetId: '#projects' },
  { title: 'Connect Artist', cat: 'STARTUP BRANDING', image: '/images/connect-artist-pitch.jpg', type: 'image', targetId: '#projects' },
  { title: 'Sports Campaign', cat: 'CAMPAIGN DESIGN', image: '/images/sports-campaign-grid.jpg', type: 'image', targetId: '#projects' },
  { title: 'Event Highlight Film', cat: 'VIDEO EDITING', image: '/images/event-poster.jpg', type: 'image', targetId: '#media' },
  { title: 'Behind the Scenes', cat: 'BTS DOCUMENTARY', image: '/images/gallery-poster-bts.jpg', type: 'image', targetId: '#media' },
  { title: 'Sambhav Jain Profile', cat: 'CREATIVE WORKFLOW', image: '/images/profile.jpg', type: 'image', targetId: '#about' },
  { title: 'Sportikon Identity', cat: 'BRAND IDENTITY', image: '/images/sportikon-brand.jpg', type: 'image', targetId: '#projects' }
]

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Custom Background States
  const [heroBg, setHeroBg] = useState<{ src: string; type: 'image' | 'video' } | null>(() => {
    if (typeof window !== 'undefined') {
      const cachedSrc = localStorage.getItem('cached_hero_bg_src')
      const cachedType = localStorage.getItem('cached_hero_bg_type') as 'image' | 'video' | null
      if (cachedSrc && cachedType) {
        return { src: cachedSrc, type: cachedType }
      }
    }
    return null
  })
  const [showHeroBg, setShowHeroBg] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cached_hero_show_bg') === 'true'
    }
    return false
  })

  // Dynamic media uploads from Supabase (Category = HERO_CAROUSEL)
  const [cards, setCards] = useState<CardItem[]>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('cached_hero_cards') : null
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch (e) {
        return defaultCards
      }
    }
    return defaultCards
  })

  // Dragging and Parallax States
  const [rotation, setRotation] = useState(0) // in degrees
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartY, setDragStartY] = useState(0)
  const [baseRotation, setBaseRotation] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Mouse position for parallax float (range: -0.5 to 0.5)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 })

  // Track viewport width for responsive 3D sizing
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  // Fetch dynamic items from Supabase
  useEffect(() => {
    async function loadHeroMedia() {
      try {
        const { data, error } = await supabase
          .from('media')
          .select('*')
          .eq('category', 'HERO_CAROUSEL')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          const dbCards = data.map((item: any) => ({
            title: item.title || 'Untitled',
            cat: '3D GALLERY',
            image: item.src,
            type: item.type || 'image',
            targetId: item.type === 'video' ? '#media' : '#projects'
          }))

          if (dbCards.length === 0) {
            setCards([])
            localStorage.setItem('cached_hero_cards', JSON.stringify([]))
          } else {
            // Replicate if needed to ensure at least 6 items for circular ring
            let displayCards = [...dbCards]
            if (displayCards.length < 6) {
              while (displayCards.length < 6) {
                displayCards = [...displayCards, ...dbCards]
              }
            }
            setCards(displayCards)
            localStorage.setItem('cached_hero_cards', JSON.stringify(displayCards))
          }
        }
      } catch (err) {
        console.warn('Could not load hero media from Supabase:', err)
      }
    }

    async function loadHeroBgAndSettings() {
      try {
        const { data: bgData, error: bgError } = await supabase
          .from('media')
          .select('*')
          .eq('category', 'HERO_BG')
          .maybeSingle()

        if (bgError) throw bgError

        if (bgData) {
          setHeroBg({ src: bgData.src, type: bgData.type || 'image' })
          localStorage.setItem('cached_hero_bg_src', bgData.src)
          localStorage.setItem('cached_hero_bg_type', bgData.type || 'image')
        } else {
          setHeroBg(null)
          localStorage.removeItem('cached_hero_bg_src')
          localStorage.removeItem('cached_hero_bg_type')
        }

        const { data: settingsData, error: settingsError } = await supabase
          .from('media')
          .select('*')
          .eq('category', 'HERO_BG_SETTINGS')
          .maybeSingle()

        if (settingsError) throw settingsError

        if (settingsData) {
          const isShow = settingsData.src === 'true'
          setShowHeroBg(isShow)
          localStorage.setItem('cached_hero_show_bg', isShow ? 'true' : 'false')
        } else {
          setShowHeroBg(false)
          localStorage.setItem('cached_hero_show_bg', 'false')
        }
      } catch (err) {
        console.warn('Could not load hero background configuration from Supabase:', err)
      }
    }

    loadHeroMedia()
    loadHeroBgAndSettings()
  }, [])

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Inertial smooth mouse tracking for parallax float
  useEffect(() => {
    let animId: number
    const smoothFloat = () => {
      setMousePos(prev => ({
        x: prev.x + (targetMousePos.x - prev.x) * 0.1,
        y: prev.y + (targetMousePos.y - prev.y) * 0.1
      }))
      animId = requestAnimationFrame(smoothFloat)
    }
    animId = requestAnimationFrame(smoothFloat)
    return () => cancelAnimationFrame(animId)
  }, [targetMousePos])

  // Track global mouse move for float effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5
      const y = (e.clientY / window.innerHeight) - 0.5
      setTargetMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Auto slow rotation when not dragging
  useEffect(() => {
    if (isDragging) return
    const interval = setInterval(() => {
      setRotation(r => r - 0.12)
    }, 30)
    return () => clearInterval(interval)
  }, [isDragging])

  // Dragging event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }

    setIsDragging(true)
    setIsScrolling(false)
    setDragStartX(e.clientX)
    setDragStartY(e.clientY)
    setBaseRotation(rotation)
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId)
    }
    playUISound('click')
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isScrolling) return
    const deltaX = e.clientX - dragStartX
    const deltaY = e.clientY - dragStartY

    // Differentiate scroll gesture (vertical swipe) from rotation drag
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      setIsScrolling(true)
      setIsDragging(false)
      if (containerRef.current) {
        containerRef.current.releasePointerCapture(e.pointerId)
      }
      return
    }

    const sensitivity = width < 768 ? 0.35 : 0.22
    const newRot = baseRotation + deltaX * sensitivity
    
    if (Math.abs(newRot - rotation) > 6) {
      playUISound('swipe')
    }
    
    setRotation(newRot)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    setIsScrolling(false)
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId)
    }
    playUISound('click')
  }

  const scrollTo = (id: string) => {
    playUISound('click')
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // 3D cylindrical distribution calculation
  const getCardTransform = (index: number) => {
    const totalCards = cards.length || 1
    const angleOffset = (360 / totalCards) * index
    const currentAngle = rotation + angleOffset
    const angleRad = (currentAngle * Math.PI) / 180

    // Fine-grained proportional cylinder radius
    let radius = 640
    if (width < 480) {
      radius = 290
    } else if (width < 768) {
      radius = 400
    } else if (width < 1024) {
      radius = 500
    }
    
    const x = Math.sin(angleRad) * radius
    const z = Math.cos(angleRad) * radius - radius

    const waveFactor = width < 768 ? 0.07 : 0.12
    const sinFactor = width < 768 ? 8 : 15
    const y = x * waveFactor + Math.sin(angleRad * 2.0) * sinFactor
    const rotateY = currentAngle
    const rotateZ = currentAngle * 0.06

    const mouseOffsetX = mousePos.x * 50
    const mouseOffsetY = mousePos.y * 30
    
    return {
      transform: `translate3d(${x + mouseOffsetX}px, ${y + mouseOffsetY}px, ${z}px) rotateY(${rotateY + mousePos.x * 12}deg) rotateZ(${rotateZ}deg) rotateX(${mousePos.y * -10}deg)`,
      zIndex: Math.round(z + radius)
    }
  }

  // Fine-grained proportional card width sizing
  let cardWidth = 240
  if (width < 480) {
    cardWidth = 115
  } else if (width < 768) {
    cardWidth = 175
  } else if (width < 1024) {
    cardWidth = 205
  }

  return (
    <section
      id="home"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative overflow-hidden flex flex-col justify-between select-none"
      style={{
        minHeight: '100dvh',
        background: '#D2D2D2',
        padding: 'clamp(95px, 12vh, 120px) clamp(24px, 6vw, 80px) clamp(32px, 6vh, 60px)',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'pan-y'
      }}
    >
      {/* Custom background media */}
      {showHeroBg && heroBg && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {heroBg.type === 'video' ? (
            <video
              key={heroBg.src}
              src={heroBg.src}
              className="w-full h-full object-cover filter grayscale opacity-20"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={heroBg.src}
              alt="Hero backdrop"
              className="w-full h-full object-cover filter grayscale opacity-20"
            />
          )}
        </div>
      )}

      {/* Background Grid Lines for Studio Vibe */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      {/* 1. MAIN DISPLAY HERO TYPOGRAPHY */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mt-auto mb-auto pointer-events-none">
        <h1 
          className="font-display tracking-tight text-[#1C1C1C] leading-[0.8] mb-1 select-none"
          style={{
            fontSize: 'clamp(38px, 11vw, 190px)',
            transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -10}px, 0)`
          }}
        >
          DESIGN IN
        </h1>

        <div 
          className="my-2 sm:my-3 py-1 flex items-center justify-center pointer-events-auto"
          style={{
            transform: `translate3d(${mousePos.x * 10}px, ${mousePos.y * 5}px, 0)`
          }}
        >
          <div 
            className="text-[9px] sm:text-[12px] font-bold tracking-[0.12em] sm:tracking-[0.25em] text-neutral-500 uppercase px-4 sm:px-6 py-1.5 sm:py-2 border border-neutral-400 max-w-[280px] sm:max-w-none text-center leading-normal"
            style={{
              borderRadius: '20px',
              background: 'rgba(210, 210, 210, 0.4)',
              backdropFilter: 'blur(4px)'
            }}
          >
            EXPLORING IDEAS THROUGH DAILY DESIGN PRACTICE
          </div>
        </div>

        <h1 
          className="font-display tracking-tight text-[#1C1C1C] leading-[0.8] mt-1 select-none"
          style={{
            fontSize: 'clamp(38px, 11vw, 190px)',
            transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -10}px, 0)`
          }}
        >
          MOTION
        </h1>
      </div>

      {/* 2. 3D INTERACTIVE CARD RIBBON */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 ribbon-perspective overflow-hidden"
        style={{
          marginTop: width < 768 ? '10%' : '6%',
          transform: width < 768 ? 'translateY(35px)' : 'none'
        }}
      >
        <div 
          className="relative w-full h-[320px] flex items-center justify-center ribbon-container-3d"
        >
          {cards.map((card, idx) => {
            const cardStyle = getCardTransform(idx)
            return (
              <a
                key={idx}
                href={card.targetId}
                onClick={(e) => { e.preventDefault(); scrollTo(card.targetId) }}
                className="absolute bg-neutral-900 pointer-events-auto ribbon-item-3d group cursor-pointer border border-neutral-800 block"
                style={{
                  ...cardStyle,
                  width: `${cardWidth}px`,
                  height: `${cardWidth * 0.75}px`,
                  borderRadius: '12px',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                  overflow: 'hidden'
                }}
                onMouseEnter={() => playUISound('hover')}
              >
                {/* Visual Image or Video */}
                {card.type === 'video' ? (
                  <video 
                    src={card.image} 
                    className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause()
                      e.currentTarget.currentTime = 0
                    }}
                  />
                ) : (
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                    draggable={false}
                  />
                )}
                
                {/* Hover overlay text */}
                <div 
                  className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 50%, transparent)',
                    zIndex: 2
                  }}
                >
                  <span className="text-[9px] tracking-[0.2em] font-bold text-[#E60012] uppercase mb-1">
                    {card.cat}
                  </span>
                  <h4 className="font-display text-[14px] sm:text-[16px] text-white tracking-tight uppercase leading-tight">
                    {card.title}
                  </h4>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* 3. BOTTOM BAR DETAILS */}
      <div className="relative z-30 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 border-t border-neutral-400">
        <p 
          className="max-w-[420px] text-[13px] leading-relaxed text-neutral-600 font-medium"
          style={{
            transform: `translate3d(${mousePos.x * 8}px, ${mousePos.y * 4}px, 0)`
          }}
        >
          Concepts, explorations, and interface experiments shared openly as part of my creative process.
        </p>

        <div 
          className="flex items-center"
          style={{
            transform: `translate3d(${mousePos.x * -8}px, ${mousePos.y * -4}px, 0)`
          }}
        >
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); scrollTo('#projects') }}
            onMouseEnter={() => playUISound('hover')}
            className="text-[13px] font-bold tracking-[0.15em] text-[#1C1C1C] no-underline pb-1 transition-all duration-300 hover:border-b-black group shrink-0"
            style={{
              borderBottom: '1.5px solid rgba(28, 28, 28, 0.2)',
            }}
          >
            VIEW MY PROJECTS <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}
