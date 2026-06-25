import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'
import { playUISound } from '../lib/sound'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  src: string
  category: string
  title: string
}

const defaultItems: MediaItem[] = [
  { id: '1', type: 'image', src: '/images/sportikon-brand.jpg', category: 'SPORTS BRANDING', title: 'Sportikon BU — Brand Identity' },
  { id: '2', type: 'video', src: '/videos/event-highlight-reel.mp4', category: 'VIDEO', title: 'Event Highlight Reel' },
  { id: '3', type: 'image', src: '/images/merch-collection.jpg', category: 'MERCH DESIGN', title: 'Sports Merch Drop' },
  { id: '4', type: 'image', src: '/images/connect-artist-pitch.jpg', category: 'STARTUP BRANDING', title: 'Connect Artist' },
  { id: '5', type: 'image', src: '/images/sports-campaign-grid.jpg', category: 'CAMPAIGN DESIGN', title: 'Sports Committee Campaign' },
  { id: '6', type: 'video', src: '/videos/bts-documentary.mp4', category: 'BTS DOCUMENTARY', title: 'Behind the Scenes' },
]

function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleClose = () => {
    playUISound('click')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <button
        className="absolute top-6 right-6 font-['Bebas_Neue'] text-white bg-transparent border-none cursor-crosshair transition-colors duration-200 hover:text-[#E60012] select-none"
        style={{ fontSize: '48px' }}
        onClick={handleClose}
        aria-label="Close"
      >
        ×
      </button>

      <div
        className="flex flex-col items-center"
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'image' ? (
          <img
            src={item.src}
            alt={item.title}
            className="max-w-full max-h-[75vh] object-contain"
            style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          />
        ) : (
          <video
            src={item.src}
            controls
            autoPlay
            className="max-w-full max-h-[75vh]"
            style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          />
        )}
        <div className="mt-6 text-center">
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', color: '#E60012', textTransform: 'uppercase' }}>
            {item.category}
          </div>
          <div className="font-['Bebas_Neue'] mt-2" style={{ fontSize: '26px', color: '#FFFFFF', letterSpacing: '0.02em' }}>
            {item.title}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MediaGallery() {
  const [items, setItems] = useState<MediaItem[]>(defaultItems)
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

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
  }, [items])

  useEffect(() => {
    async function loadMedia() {
      try {
        const { data, error } = await supabase
          .from('media')
          .select('*')
          .neq('category', 'HERO_BG')
          .neq('category', 'HERO_CAROUSEL')
          .order('created_at', { ascending: true })

        if (error) throw error

        if (data) {
          const dbItems: MediaItem[] = data.map((item: any) => ({
            id: item.id,
            type: item.type,
            src: item.src,
            category: item.category,
            title: item.title,
          }))
          setItems(dbItems)
        }
      } catch (err) {
        console.warn('Could not load Supabase media items, falling back to local:', err)
      }
    }

    loadMedia()
  }, [])

  return (
    <section
      id="media"
      ref={sectionRef}
      className="theme-dark-section"
      style={{
        background: 'var(--bg-dark)',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)',
        transition: 'background-color 0.4s ease'
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div
              className="flex items-center gap-4 mb-3"
              style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#E60012', textTransform: 'uppercase' }}
            >
              005 — MEDIA
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)', maxWidth: '50px' }}></div>
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(44px, 6vw, 88px)',
                lineHeight: 0.9,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              VISUAL WORK
            </h2>
            <p className="mt-4" style={{ fontSize: '15px', color: '#888888', lineHeight: 1.65 }}>
              A curated selection of design work, event coverage, and creative experiments. Click any item to view.
            </p>
          </div>

          {/* Manage button */}
          <button
            onClick={() => {
              playUISound('click')
              navigate('/admin')
            }}
            onMouseEnter={() => playUISound('hover')}
            className="transition-all duration-300 hover:bg-white hover:text-black shrink-0 font-mono cursor-crosshair select-none"
            style={{
              background: '#E60012',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '14px 28px',
              borderRadius: '24px',
              border: 'none',
            }}
          >
            MANAGE GALLERY →
          </button>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="rv relative overflow-hidden cursor-crosshair group"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(0,0,0,0.2)',
                aspectRatio: '4/3',
                borderRadius: '12px'
              }}
              onMouseEnter={() => playUISound('hover')}
              onClick={() => {
                playUISound('click')
                setLightboxItem(item)
              }}
            >
              {/* Media */}
              {item.type === 'image' ? (
                <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={item.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                  />
                  <img
                    src={item.src}
                    alt={item.title}
                    className="relative max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    style={{ zIndex: 1 }}
                  />
                </div>
              ) : (
                <div className="relative w-full h-full bg-black">
                  <video
                    src={item.src}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => {
                      e.currentTarget.play()
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause()
                    }}
                  />
                  {/* Play icon */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#E60012',
                        boxShadow: '0 8px 16px rgba(230,0,18,0.2)'
                      }}
                    >
                      <svg width="14" height="16" viewBox="0 0 16 18" fill="none">
                        <path d="M16 9L0 18V0L16 9Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Info bar overlay */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
                  padding: '48px 24px 24px',
                  zIndex: 2,
                }}
              >
                <div
                  style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', color: '#E60012', textTransform: 'uppercase', marginBottom: '6px' }}
                >
                  {item.category}
                </div>
                <h3
                  className="font-['Bebas_Neue']"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '0.01em' }}
                >
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </section>
  )
}
