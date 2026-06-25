import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

interface MediaItem {
  id: string
  title: string
  category: string
  type: 'image' | 'video'
  src: string
  created_at: string
}

interface ProjectItem {
  id: string
  initials: string
  cat: string
  name: string
  desc: string
  featured: boolean
  created_at: string
  image_url?: string
}

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [activeTab, setActiveTab] = useState<'media' | 'projects'>('media')

  // Media Gallery states (Excludes HERO_BG and HERO_CAROUSEL)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(true)
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaCategory, setMediaCategory] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hero 3D Carousel states (Specifically category = 'HERO_CAROUSEL')
  const [heroCarouselItems, setHeroCarouselItems] = useState<MediaItem[]>([])
  const [loadingHeroCarousel, setLoadingHeroCarousel] = useState(true)
  const [heroCarouselTitle, setHeroCarouselTitle] = useState('')
  const [heroCarouselType, setHeroCarouselType] = useState<'image' | 'video'>('image')
  const [heroCarouselFile, setHeroCarouselFile] = useState<File | null>(null)
  const [uploadingHeroCarousel, setUploadingHeroCarousel] = useState(false)
  const heroCarouselFileInputRef = useRef<HTMLInputElement>(null)

  // Hero Background states
  const [heroBgFile, setHeroBgFile] = useState<File | null>(null)
  const [uploadingHeroBg, setUploadingHeroBg] = useState(false)
  const [currentHeroBg, setCurrentHeroBg] = useState<string | null>(null)
  const [heroBgType, setHeroBgType] = useState<'image' | 'video'>('image')
  const [showHeroBg, setShowHeroBg] = useState(false)
  const [updatingShowHeroBg, setUpdatingShowHeroBg] = useState(false)
  const heroBgFileInputRef = useRef<HTMLInputElement>(null)

  // Projects Tab states
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projInitials, setProjInitials] = useState('')
  const [projCat, setProjCat] = useState('')
  const [projName, setProjName] = useState('')
  const [projDesc, setProjDesc] = useState('')
  const [projFeatured, setProjFeatured] = useState(false)
  const [projFile, setProjFile] = useState<File | null>(null)
  const [uploadingProj, setUploadingProj] = useState(false)
  const projFileInputRef = useRef<HTMLInputElement>(null)
  const [editingProjId, setEditingProjId] = useState<string | null>(null)
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null)
  const [editingHeroCarouselId, setEditingHeroCarouselId] = useState<string | null>(null)

  const handleStartEditProject = (item: ProjectItem) => {
    setEditingProjId(item.id)
    setProjInitials(item.initials)
    setProjCat(item.cat)
    setProjName(item.name)
    setProjDesc(item.desc || '')
    setProjFeatured(item.featured)
    setProjFile(null)
    if (projFileInputRef.current) projFileInputRef.current.value = ''
  }

  const handleStartEditMedia = (item: MediaItem) => {
    setEditingMediaId(item.id)
    setMediaTitle(item.title)
    setMediaCategory(item.category)
    setMediaType(item.type)
    setMediaFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleStartEditHeroCarousel = (item: MediaItem) => {
    setEditingHeroCarouselId(item.id)
    setHeroCarouselTitle(item.title)
    setHeroCarouselType(item.type)
    setHeroCarouselFile(null)
    if (heroCarouselFileInputRef.current) heroCarouselFileInputRef.current.value = ''
  }

  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentSession = data.session
      setSession(currentSession)
      setLoadingSession(false)
      if (!currentSession) {
        navigate('/admin/login')
      } else {
        fetchMedia()
        fetchProjects()
        fetchHeroBg()
        fetchHeroCarousel()
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session)
      if (!session) {
        navigate('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const fetchMedia = async (silent?: boolean) => {
    const isSilent = silent === true
    if (!isSilent) setLoadingMedia(true)
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .neq('category', 'HERO_BG')
        .neq('category', 'HERO_CAROUSEL')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to fetch media list: ' + error.message)
      } else {
        setMediaItems(data || [])
      }
    } catch (err: any) {
      toast.error('Error fetching media items: ' + err.message)
    } finally {
      if (!isSilent) setLoadingMedia(false)
    }
  }

  const fetchHeroCarousel = async (silent?: boolean) => {
    const isSilent = silent === true
    if (!isSilent) setLoadingHeroCarousel(true)
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('category', 'HERO_CAROUSEL')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to fetch hero carousel cards: ' + error.message)
      } else {
        setHeroCarouselItems(data || [])
      }
    } catch (err: any) {
      toast.error('Error fetching hero carousel items: ' + err.message)
    } finally {
      if (!isSilent) setLoadingHeroCarousel(false)
    }
  }

  const fetchProjects = async (silent?: boolean) => {
    const isSilent = silent === true
    if (!isSilent) setLoadingProjects(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to fetch projects list: ' + error.message)
      } else {
        const mappedData = (data || []).map((item: any) => ({
          ...item,
          desc: item.description,
        }))
        setProjectItems(mappedData)
      }
    } catch (err: any) {
      toast.error('Error fetching projects: ' + err.message)
    } finally {
      if (!isSilent) setLoadingProjects(false)
    }
  }

  const fetchHeroBg = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('category', 'HERO_BG')
        .maybeSingle()

      if (error) {
        console.warn('Failed to fetch hero background:', error.message)
      } else if (data) {
        setCurrentHeroBg(data.src)
        setHeroBgType(data.type || 'image')
      } else {
        setCurrentHeroBg(null)
        setHeroBgType('image')
      }

      // Fetch show/hide setting
      const { data: settingsData, error: settingsError } = await supabase
        .from('media')
        .select('*')
        .eq('category', 'HERO_BG_SETTINGS')
        .maybeSingle()

      if (settingsError) {
        console.warn('Failed to fetch hero background settings:', settingsError.message)
      } else if (settingsData) {
        setShowHeroBg(settingsData.src === 'true')
      } else {
        setShowHeroBg(false)
      }
    } catch (err: any) {
      console.warn('Error fetching hero background:', err.message)
    }
  }

  const handleToggleShowHeroBg = async (checked: boolean) => {
    setUpdatingShowHeroBg(true)
    const toastId = toast.loading('Saving background setting...')
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('category', 'HERO_BG_SETTINGS')
        .maybeSingle()

      if (fetchError) throw fetchError

      if (existing) {
        const { error: dbError } = await supabase
          .from('media')
          .update({
            src: checked ? 'true' : 'false',
            title: 'show_background',
          })
          .eq('id', existing.id)

        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase.from('media').insert({
          title: 'show_background',
          category: 'HERO_BG_SETTINGS',
          type: 'image',
          src: checked ? 'true' : 'false',
        })

        if (dbError) throw dbError
      }

      setShowHeroBg(checked)
      toast.success('Setting updated successfully!', { id: toastId })
    } catch (err: any) {
      toast.error('Failed to update setting: ' + err.message, { id: toastId })
    } finally {
      setUpdatingShowHeroBg(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const getPathFromPublicUrl = (url: string) => {
    const parts = url.split('/public/media/')
    return parts.length > 1 ? parts[1] : null
  }

  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault()
    const isEdit = !!editingMediaId
    if (!mediaFile && !isEdit) {
      toast.error('Please select a file to upload')
      return
    }
    if (!mediaTitle.trim() || !mediaCategory.trim()) {
      toast.error('Please enter a title and category')
      return
    }

    setUploadingMedia(true)
    const toastId = toast.loading(isEdit ? 'Updating media item...' : 'Uploading media file...')

    try {
      let srcUrl = null
      const existingMedia = isEdit ? mediaItems.find(m => m.id === editingMediaId) : null

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, mediaFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        srcUrl = publicUrl

        if (isEdit && existingMedia?.src) {
          const oldFilePath = getPathFromPublicUrl(existingMedia.src)
          if (oldFilePath) {
            await supabase.storage.from('media').remove([oldFilePath])
          }
        }
      } else if (isEdit && existingMedia) {
        srcUrl = existingMedia.src
      }

      if (isEdit) {
        const { error: dbError } = await supabase
          .from('media')
          .update({
            title: mediaTitle.trim(),
            category: mediaCategory.trim().toUpperCase(),
            type: mediaType,
            src: srcUrl,
          })
          .eq('id', editingMediaId)

        if (dbError) throw dbError
        toast.success('Media updated successfully!', { id: toastId })
      } else {
        const { error: dbError } = await supabase.from('media').insert({
          title: mediaTitle.trim(),
          category: mediaCategory.trim().toUpperCase(),
          type: mediaType,
          src: srcUrl,
        })

        if (dbError) throw dbError
        toast.success('Uploaded and saved successfully!', { id: toastId })
      }

      setMediaTitle('')
      setMediaCategory('')
      setMediaFile(null)
      setEditingMediaId(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchMedia(true)
    } catch (err: any) {
      toast.error(err.message || (isEdit ? 'Failed to update media' : 'Failed to upload media'), { id: toastId })
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleUploadHeroCarousel = async (e: React.FormEvent) => {
    e.preventDefault()
    const isEdit = !!editingHeroCarouselId
    if (!heroCarouselFile && !isEdit) {
      toast.error('Please select a file to upload')
      return
    }
    if (!heroCarouselTitle.trim()) {
      toast.error('Please enter a card title')
      return
    }

    setUploadingHeroCarousel(true)
    const toastId = toast.loading(isEdit ? 'Updating 3D Card...' : 'Uploading 3D Card...')

    try {
      let srcUrl = null
      const existingHero = isEdit ? heroCarouselItems.find(h => h.id === editingHeroCarouselId) : null

      if (heroCarouselFile) {
        const fileExt = heroCarouselFile.name.split('.').pop()
        const fileName = `hero_carousel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, heroCarouselFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        srcUrl = publicUrl

        if (isEdit && existingHero?.src) {
          const oldFilePath = getPathFromPublicUrl(existingHero.src)
          if (oldFilePath) {
            await supabase.storage.from('media').remove([oldFilePath])
          }
        }
      } else if (isEdit && existingHero) {
        srcUrl = existingHero.src
      }

      if (isEdit) {
        const { error: dbError } = await supabase
          .from('media')
          .update({
            title: heroCarouselTitle.trim(),
            type: heroCarouselType,
            src: srcUrl,
          })
          .eq('id', editingHeroCarouselId)

        if (dbError) throw dbError
        toast.success('Hero 3D Card updated successfully!', { id: toastId })
      } else {
        const { error: dbError } = await supabase.from('media').insert({
          title: heroCarouselTitle.trim(),
          category: 'HERO_CAROUSEL',
          type: heroCarouselType,
          src: srcUrl,
        })

        if (dbError) throw dbError
        toast.success('Hero 3D Card added successfully!', { id: toastId })
      }

      setHeroCarouselTitle('')
      setHeroCarouselFile(null)
      setEditingHeroCarouselId(null)
      if (heroCarouselFileInputRef.current) heroCarouselFileInputRef.current.value = ''
      fetchHeroCarousel(true)
    } catch (err: any) {
      toast.error(err.message || (isEdit ? 'Failed to update Hero 3D card' : 'Failed to upload Hero 3D card'), { id: toastId })
    } finally {
      setUploadingHeroCarousel(false)
    }
  }

  const handleDeleteMedia = async (id: string, src: string) => {
    if (!confirm('Are you sure you want to permanently delete this media item?')) return

    const toastId = toast.loading('Deleting media...')
    try {
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      const filePath = getPathFromPublicUrl(src)
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove([filePath])

        if (storageError) {
          console.warn('Storage deletion failed, but DB record was removed:', storageError.message)
        }
      }

      toast.success('Media deleted successfully', { id: toastId })
      fetchMedia(true)
      fetchHeroCarousel(true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete media', { id: toastId })
    }
  }

  const handleUploadProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projInitials.trim() || !projCat.trim() || !projName.trim() || !projDesc.trim()) {
      toast.error('Please fill all project fields')
      return
    }

    setUploadingProj(true)
    const isEdit = !!editingProjId
    const toastId = toast.loading(isEdit ? 'Updating project...' : 'Adding new project...')

    try {
      let imageUrl = null
      const existingProj = isEdit ? projectItems.find(p => p.id === editingProjId) : null

      if (projFile) {
        const fileExt = projFile.name.split('.').pop()
        const fileName = `${Date.now()}_project_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, projFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        imageUrl = publicUrl

        if (isEdit && existingProj?.image_url) {
          const oldFilePath = getPathFromPublicUrl(existingProj.image_url)
          if (oldFilePath) {
            await supabase.storage.from('media').remove([oldFilePath])
          }
        }
      } else if (isEdit && existingProj) {
        imageUrl = existingProj.image_url
      }

      if (isEdit) {
        const { error } = await supabase
          .from('projects')
          .update({
            initials: projInitials.trim().substring(0, 3).toUpperCase(),
            cat: projCat.trim(),
            name: projName.trim(),
            description: projDesc.trim(),
            featured: projFeatured,
            image_url: imageUrl,
          })
          .eq('id', editingProjId)

        if (error) throw error
        toast.success('Project updated successfully!', { id: toastId })
      } else {
        const { error } = await supabase.from('projects').insert({
          initials: projInitials.trim().substring(0, 3).toUpperCase(),
          cat: projCat.trim(),
          name: projName.trim(),
          description: projDesc.trim(),
          featured: projFeatured,
          image_url: imageUrl,
        })

        if (error) throw error
        toast.success('Project added successfully!', { id: toastId })
      }

      setProjInitials('')
      setProjCat('')
      setProjName('')
      setProjDesc('')
      setProjFeatured(false)
      setProjFile(null)
      setEditingProjId(null)
      if (projFileInputRef.current) projFileInputRef.current.value = ''
      fetchProjects(true)
    } catch (err: any) {
      toast.error(err.message || (isEdit ? 'Failed to update project' : 'Failed to add project'), { id: toastId })
    } finally {
      setUploadingProj(false)
    }
  }

  const handleDeleteProject = async (id: string, imageUrl?: string) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return

    const toastId = toast.loading('Deleting project...')
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      if (imageUrl) {
        const filePath = getPathFromPublicUrl(imageUrl)
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('media')
            .remove([filePath])

          if (storageError) {
            console.warn('Storage deletion failed, but DB record was removed:', storageError.message)
          }
        }
      }

      toast.success('Project deleted successfully', { id: toastId })
      fetchProjects(true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete project', { id: toastId })
    }
  }

  const handleUploadHeroBg = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!heroBgFile) {
      toast.error('Please select an image or video file to upload')
      return
    }

    setUploadingHeroBg(true)
    const toastId = toast.loading('Uploading hero background...')

    try {
      const fileExt = heroBgFile.name.split('.').pop()
      const fileName = `hero_bg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, heroBgFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      const { data: existing, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('category', 'HERO_BG')
        .maybeSingle()

      if (fetchError) throw fetchError

      const isVideo = heroBgFile.type.startsWith('video/')
      const mediaType = isVideo ? 'video' : 'image'

      if (existing) {
        const oldFilePath = getPathFromPublicUrl(existing.src)
        if (oldFilePath) {
          await supabase.storage.from('media').remove([oldFilePath])
        }

        const { error: dbError } = await supabase
          .from('media')
          .update({
            src: publicUrl,
            title: 'Hero Background',
            type: mediaType
          })
          .eq('id', existing.id)

        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase.from('media').insert({
          title: 'Hero Background',
          category: 'HERO_BG',
          type: mediaType,
          src: publicUrl,
        })

        if (dbError) throw dbError
      }

      toast.success('Hero background updated successfully!', { id: toastId })
      setHeroBgFile(null)
      if (heroBgFileInputRef.current) heroBgFileInputRef.current.value = ''
      fetchHeroBg()
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload hero background', { id: toastId })
    } finally {
      setUploadingHeroBg(false)
    }
  }

  const handleDeleteHeroBg = async () => {
    if (!currentHeroBg) return
    if (!confirm('Are you sure you want to remove the custom hero background? The default black background will be used.')) return

    const toastId = toast.loading('Removing hero background...')
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('category', 'HERO_BG')
        .maybeSingle()

      if (fetchError) throw fetchError

      if (existing) {
        const { error: dbError } = await supabase
          .from('media')
          .delete()
          .eq('id', existing.id)

        if (dbError) throw dbError

        const filePath = getPathFromPublicUrl(existing.src)
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('media')
            .remove([filePath])

          if (storageError) {
            console.warn('Storage deletion failed, but DB record was removed:', storageError.message)
          }
        }
      }

      setCurrentHeroBg(null)
      toast.success('Hero background removed successfully', { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove hero background', { id: toastId })
    }
  }

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-['Space_Mono'] text-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-t-[#E60012] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-[12px] tracking-[0.2em] text-[#7A7A7A]">VERIFYING SECURITY...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Space_Mono'] pb-16">
      {/* Navigation */}
      <nav
        className="sticky top-0 z-[100] flex items-center justify-between border-b border-[#2A2A2A] bg-black/90 backdrop-blur-md px-6 py-4"
        style={{ height: '60px' }}
      >
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="font-display text-[22px] tracking-[0.06em] text-white no-underline select-none"
          >
            SAMBHAV<span style={{ color: '#E60012' }}>®</span>
          </a>
          <span className="text-[11px] tracking-[0.15em] text-[#7A7A7A] hidden sm:inline">
            / ADMIN PANEL
          </span>
        </div>

        <div className="flex items-center gap-6">
          {session?.user?.email && (
            <span className="text-[11px] text-[#7A7A7A] hidden md:inline font-mono">
              USER: {session.user.email}
            </span>
          )}
          <a
            href="/"
            className="text-[12px] hover:text-[#E60012] transition-colors duration-200 no-underline font-bold"
          >
            VIEW SITE
          </a>
          <button
            onClick={handleLogout}
            className="text-[12px] bg-[#E60012] text-white hover:bg-white hover:text-black px-4 py-1.5 transition-all duration-300 font-bold"
            style={{ cursor: 'crosshair' }}
          >
            LOGOUT
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8 flex border-b border-[#2A2A2A]">
        <button
          onClick={() => setActiveTab('media')}
          className={`pb-4 px-6 font-bold tracking-[0.1em] text-[13px] border-b-2 transition-all duration-300 ${
            activeTab === 'media' ? 'border-[#E60012] text-white' : 'border-transparent text-[#7A7A7A]'
          }`}
          style={{ cursor: 'crosshair' }}
        >
          MEDIA GALLERY
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-4 px-6 font-bold tracking-[0.1em] text-[13px] border-b-2 transition-all duration-300 ${
            activeTab === 'projects' ? 'border-[#E60012] text-white' : 'border-transparent text-[#7A7A7A]'
          }`}
          style={{ cursor: 'crosshair' }}
        >
          PORTFOLIO PROJECTS
        </button>
      </div>

      {activeTab === 'media' ? (
        /* ==================== MEDIA GALLERY TAB ==================== */
        <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card 1: Upload Hero Carousel Card */}
            <Card
              className="bg-[#0A0A0A] border-[#2A2A2A] text-white rounded-none p-6"
              style={{ border: '1px solid #2A2A2A' }}
            >
              <CardHeader className="p-0 mb-6">
                <div className="text-[12px] tracking-[0.2em] text-[#E60012] mb-1">
                  {editingHeroCarouselId ? 'EDIT HERO CAROUSEL' : 'HERO CAROUSEL'}
                </div>
                <CardTitle className="font-['Bebas_Neue'] text-3xl tracking-[0.05em] uppercase">
                  {editingHeroCarouselId ? 'Edit Hero 3D Card' : 'Upload Hero 3D Card'}
                </CardTitle>
                <CardDescription className="text-[#7A7A7A] text-[13px] font-sans">
                  {editingHeroCarouselId ? 'Update title, media type or choose a new file for this slide.' : 'Add image/video slides specifically for the 3D rotating ribbon in the Hero header.'}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleUploadHeroCarousel} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Card Title
                  </label>
                  <Input
                    type="text"
                    required
                    disabled={uploadingHeroCarousel}
                    value={heroCarouselTitle}
                    onChange={(e) => setHeroCarouselTitle(e.target.value)}
                    placeholder="e.g. Sportikon Cover Reel"
                    className="bg-transparent text-white border-0 border-b border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px] w-full p-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Media Type
                  </label>
                  <select
                    value={heroCarouselType}
                    onChange={(e) => setHeroCarouselType(e.target.value as 'image' | 'video')}
                    disabled={uploadingHeroCarousel}
                    className="w-full bg-black text-white outline-none cursor-crosshair border-0 border-b border-[#2A2A2A] p-2 text-[14px]"
                  >
                    <option value="image">Image Card</option>
                    <option value="video">Video Card (Plays on hover)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Select File
                  </label>
                  <input
                    ref={heroCarouselFileInputRef}
                    type="file"
                    required={!editingHeroCarouselId}
                    disabled={uploadingHeroCarousel}
                    accept={heroCarouselType === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setHeroCarouselFile(e.target.files[0])
                      }
                    }}
                    className="text-white text-[12px] w-full p-2 border border-dashed border-[#2A2A2A] cursor-crosshair"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={uploadingHeroCarousel}
                    className="w-full font-bold uppercase tracking-[0.12em] text-[13px] bg-[#E60012] text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none h-12"
                    style={{ cursor: 'crosshair' }}
                  >
                    {uploadingHeroCarousel 
                      ? (editingHeroCarouselId ? 'UPDATING...' : 'UPLOADING...') 
                      : (editingHeroCarouselId ? 'SAVE CHANGES →' : 'ADD HERO CARD →')}
                  </Button>

                  {editingHeroCarouselId && (
                    <Button
                      type="button"
                      disabled={uploadingHeroCarousel}
                      onClick={() => {
                        setHeroCarouselTitle('')
                        setHeroCarouselFile(null)
                        setEditingHeroCarouselId(null)
                        if (heroCarouselFileInputRef.current) heroCarouselFileInputRef.current.value = ''
                      }}
                      className="w-full font-bold uppercase tracking-[0.12em] text-[13px] bg-neutral-800 hover:bg-neutral-700 text-white transition-all duration-300 rounded-none h-10"
                      style={{ cursor: 'crosshair' }}
                    >
                      CANCEL EDIT
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            {/* Card 2: Upload General Media */}
            <Card
              className="bg-[#0A0A0A] border-[#2A2A2A] text-white rounded-none p-6"
              style={{ border: '1px solid #2A2A2A' }}
            >
              <CardHeader className="p-0 mb-6">
                <div className="text-[12px] tracking-[0.2em] text-[#E60012] mb-1">
                  {editingMediaId ? 'EDIT MEDIA GALLERY' : 'MEDIA GALLERY'}
                </div>
                <CardTitle className="font-['Bebas_Neue'] text-3xl tracking-[0.05em] uppercase">
                  {editingMediaId ? 'Edit Gallery Media' : 'Upload Gallery Media'}
                </CardTitle>
                <CardDescription className="text-[#7A7A7A] text-[13px] font-sans">
                  {editingMediaId ? 'Update title, category, media type or choose a new file for this media item.' : 'Add designs or videos to the main "Visual Work" gallery list.'}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleUploadMedia} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Title
                  </label>
                  <Input
                    type="text"
                    required
                    disabled={uploadingMedia}
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="e.g. Sportikon BU Branding"
                    className="bg-transparent text-white border-0 border-b border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px] w-full p-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Category
                  </label>
                  <Input
                    type="text"
                    required
                    disabled={uploadingMedia}
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value)}
                    placeholder="e.g. SPORTS BRANDING"
                    className="bg-transparent text-white border-0 border-b border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px] w-full p-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Media Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                    disabled={uploadingMedia}
                    className="w-full bg-black text-white outline-none cursor-crosshair border-0 border-b border-[#2A2A2A] p-2 text-[14px]"
                  >
                    <option value="image">Image / Design</option>
                    <option value="video">Video Reel</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Select File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    required={!editingMediaId}
                    disabled={uploadingMedia}
                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setMediaFile(e.target.files[0])
                      }
                    }}
                    className="text-white text-[12px] w-full p-2 border border-dashed border-[#2A2A2A] cursor-crosshair"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={uploadingMedia}
                    className="w-full font-bold uppercase tracking-[0.12em] text-[13px] bg-[#E60012] text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none h-12"
                    style={{ cursor: 'crosshair' }}
                  >
                    {uploadingMedia 
                      ? (editingMediaId ? 'UPDATING...' : 'UPLOADING...') 
                      : (editingMediaId ? 'SAVE CHANGES →' : 'UPLOAD GALLERY ITEM →')}
                  </Button>

                  {editingMediaId && (
                    <Button
                      type="button"
                      disabled={uploadingMedia}
                      onClick={() => {
                        setMediaTitle('')
                        setMediaCategory('')
                        setMediaFile(null)
                        setEditingMediaId(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="w-full font-bold uppercase tracking-[0.12em] text-[13px] bg-neutral-800 hover:bg-neutral-700 text-white transition-all duration-300 rounded-none h-10"
                      style={{ cursor: 'crosshair' }}
                    >
                      CANCEL EDIT
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            {/* Card 3: Hero Background Backdrop */}
            <Card
              className="bg-[#0A0A0A] border-[#2A2A2A] text-white rounded-none p-6"
              style={{ border: '1px solid #2A2A2A' }}
            >
              <CardHeader className="p-0 mb-6">
                <div className="text-[12px] tracking-[0.2em] text-[#E60012] mb-1">
                  HERO SETTINGS
                </div>
                <CardTitle className="font-['Bebas_Neue'] text-3xl tracking-[0.05em] uppercase">
                  Hero Background
                </CardTitle>
                <CardDescription className="text-[#7A7A7A] text-[13px] font-sans">
                  Upload a custom backdrop image or video to display behind the main Hero header statement in grayscale.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleUploadHeroBg} className="space-y-6">
                {/* Background Visibility Toggle */}
                <div className="flex items-center justify-between p-3 bg-[#111111] border border-[#2A2A2A]">
                  <div className="pr-4">
                    <span className="text-[12px] font-bold text-white block uppercase tracking-[0.05em]">
                      Display Custom Background
                    </span>
                    <span className="text-[10px] text-[#7A7A7A] block">
                      Toggle background on/off on the live Hero section.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showHeroBg}
                    disabled={updatingShowHeroBg}
                    onChange={(e) => handleToggleShowHeroBg(e.target.checked)}
                    className="w-5 h-5 rounded accent-[#E60012] bg-black border-[#2A2A2A] cursor-crosshair"
                  />
                </div>

                {currentHeroBg && (
                  <div className="space-y-2">
                    <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                      Current Backdrop Preview ({heroBgType.toUpperCase()})
                    </label>
                    <div className="relative group aspect-video bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center">
                      {heroBgType === 'video' ? (
                        <video
                          src={currentHeroBg}
                          className="w-full h-full object-cover filter grayscale opacity-75"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img
                          src={currentHeroBg}
                          alt="Current Hero Background"
                          className="w-full h-full object-cover filter grayscale opacity-75"
                        />
                      )}
                      <button
                        type="button"
                        onClick={handleDeleteHeroBg}
                        className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-500 font-bold text-[13px] tracking-wider"
                        style={{ cursor: 'crosshair' }}
                      >
                        REMOVE BACKDROP
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    {currentHeroBg ? 'Replace Backdrop Image/Video' : 'Select Backdrop Image/Video'}
                  </label>
                  <input
                    ref={heroBgFileInputRef}
                    type="file"
                    required
                    disabled={uploadingHeroBg}
                    accept="image/*,video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setHeroBgFile(e.target.files[0])
                      }
                    }}
                    className="text-white text-[12px] w-full p-2 border border-dashed border-[#2A2A2A] cursor-crosshair"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={uploadingHeroBg}
                  className="w-full font-bold uppercase tracking-[0.12em] text-[13px] bg-[#E60012] text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none h-12"
                  style={{ cursor: 'crosshair' }}
                >
                  {uploadingHeroBg ? 'UPLOADING...' : currentHeroBg ? 'UPDATE BACKDROP →' : 'UPLOAD BACKDROP →'}
                </Button>
              </form>
            </Card>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* List 1: Manage Hero 3D Cards */}
            <Card
              className="bg-[#0A0A0A] border-[#2A2A2A] text-white rounded-none p-6"
              style={{ border: '1px solid #2A2A2A' }}
            >
              <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <div>
                  <div className="text-[12px] tracking-[0.2em] text-[#E60012] mb-1">
                    HERO CAROUSEL IMAGES
                  </div>
                  <CardTitle className="font-['Bebas_Neue'] text-3xl tracking-[0.05em] uppercase">
                    Manage Hero 3D Cards ({heroCarouselItems.length})
                  </CardTitle>
                </div>
                <button
                  onClick={() => fetchHeroCarousel()}
                  className="text-[11px] tracking-[0.1em] border border-[#2A2A2A] hover:border-white px-3 py-1 transition-colors duration-200"
                >
                  REFRESH
                </button>
              </CardHeader>

              <CardContent className="p-0">
                {loadingHeroCarousel ? (
                  <div className="py-12 text-center text-[#7A7A7A] text-[13px]">
                    Loading Hero cards...
                  </div>
                ) : heroCarouselItems.length === 0 ? (
                  <div className="py-12 text-center text-[#7A7A7A] text-[13px] border border-dashed border-[#2A2A2A]">
                    No custom Hero cards uploaded yet. Add cards on the left panel.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {heroCarouselItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black border border-[#2A2A2A] gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-[#111111] border border-[#2A2A2A] flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {item.type === 'image' ? (
                              <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <video src={item.src} className="w-full h-full object-cover" muted playsInline />
                            )}
                          </div>

                          <div className="space-y-1">
                            <span
                              className="inline-block text-[9px] tracking-[0.1em] font-bold px-2 py-0.5"
                              style={{
                                background: item.type === 'video' ? '#E60012' : '#2A2A2A',
                                color: '#FFFFFF',
                              }}
                            >
                              {item.type.toUpperCase()}
                            </span>
                            <h4 className="text-[14px] font-bold text-white leading-tight font-mono">
                              {item.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end font-sans">
                          <button
                            onClick={() => handleStartEditHeroCarousel(item)}
                            className="text-[11px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2 border border-[#2A2A2A] hover:border-[#4A4A4A] transition-all duration-300 font-bold"
                            style={{ cursor: 'crosshair' }}
                          >
                            EDIT
                          </button>

                          <button
                            onClick={() => handleDeleteMedia(item.id, item.src)}
                            className="text-[11px] bg-[#E60012]/10 hover:bg-[#E60012] text-red-500 hover:text-white px-4 py-2 border border-red-900/50 transition-all duration-300 font-bold"
                            style={{ cursor: 'crosshair' }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* List 2: Manage General Media */}
            <Card
              className="bg-[#0A0A0A] border-[#2A2A2A] text-white rounded-none p-6"
              style={{ border: '1px solid #2A2A2A' }}
            >
              <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <div>
                  <div className="text-[12px] tracking-[0.2em] text-[#E60012] mb-1">
                    CURRENT GALLERY
                  </div>
                  <CardTitle className="font-['Bebas_Neue'] text-3xl tracking-[0.05em] uppercase">
                    Manage Visual Work ({mediaItems.length})
                  </CardTitle>
                </div>
                <button
                  onClick={() => fetchMedia()}
                  className="text-[11px] tracking-[0.1em] border border-[#2A2A2A] hover:border-white px-3 py-1 transition-colors duration-200"
                >
                  REFRESH
                </button>
              </CardHeader>

              <CardContent className="p-0">
                {loadingMedia ? (
                  <div className="py-12 text-center text-[#7A7A7A] text-[13px]">
                    Loading media database...
                  </div>
                ) : mediaItems.length === 0 ? (
                  <div className="py-12 text-center text-[#7A7A7A] text-[13px] border border-dashed border-[#2A2A2A]">
                    No items found. Upload your first media item in the left panel.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mediaItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black border border-[#2A2A2A] gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-[#111111] border border-[#2A2A2A] flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {item.type === 'image' ? (
                              <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <video src={item.src} className="w-full h-full object-cover" muted playsInline />
                            )}
                          </div>

                          <div className="space-y-1">
                            <span
                              className="inline-block text-[9px] tracking-[0.1em] font-bold px-2 py-0.5"
                              style={{
                                background: item.type === 'video' ? '#E60012' : '#2A2A2A',
                                color: '#FFFFFF',
                              }}
                            >
                              {item.type.toUpperCase()}
                            </span>
                            <h4 className="text-[14px] font-bold text-white leading-tight font-mono">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-[#7A7A7A] tracking-[0.05em] uppercase font-mono">
                              CATEGORY: {item.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end font-sans">
                          <button
                            onClick={() => handleStartEditMedia(item)}
                            className="text-[11px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2 border border-[#2A2A2A] hover:border-[#4A4A4A] transition-all duration-300 font-bold"
                            style={{ cursor: 'crosshair' }}
                          >
                            EDIT
                          </button>

                          <button
                            onClick={() => handleDeleteMedia(item.id, item.src)}
                            className="text-[11px] bg-[#E60012]/10 hover:bg-[#E60012] text-red-500 hover:text-white px-4 py-2 border border-red-900/50 transition-all duration-300 font-bold"
                            style={{ cursor: 'crosshair' }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      ) : (
        /* ==================== PORTFOLIO PROJECTS TAB ==================== */
        <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card
              className="bg-[#0A0A0A] border-[#2A2A2A] text-white rounded-none p-6"
              style={{ border: '1px solid #2A2A2A' }}
            >
              <CardHeader className="p-0 mb-6">
                <div className="text-[12px] tracking-[0.2em] text-[#E60012] mb-1">
                  {editingProjId ? 'EDIT PROJECT' : 'ADD PROJECT'}
                </div>
                <CardTitle className="font-['Bebas_Neue'] text-3xl tracking-[0.05em] uppercase">
                  {editingProjId ? 'Edit Selected Work' : 'Add Selected Work'}
                </CardTitle>
                <CardDescription className="text-[#7A7A7A] text-[13px] font-sans">
                  {editingProjId ? 'Update details or replace cover image for this project.' : 'Manage the projects shown under the "Selected Work" grid.'}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleUploadProject} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 space-y-2">
                    <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                      Initials
                    </label>
                    <Input
                      type="text"
                      required
                      maxLength={3}
                      disabled={uploadingProj}
                      value={projInitials}
                      onChange={(e) => setProjInitials(e.target.value)}
                      placeholder="e.g. SB"
                      className="bg-transparent text-white border-0 border-b border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px] w-full p-2 text-center"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                      Category Label
                    </label>
                    <Input
                      type="text"
                      required
                      disabled={uploadingProj}
                      value={projCat}
                      onChange={(e) => setProjCat(e.target.value)}
                      placeholder="e.g. Sports Branding · Design"
                      className="bg-transparent text-white border-0 border-b border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px] w-full p-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Project Name
                  </label>
                  <Input
                    type="text"
                    required
                    disabled={uploadingProj}
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="e.g. Sportikon BU — Brand Identity"
                    className="bg-transparent text-white border-0 border-b border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px] w-full p-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Description
                  </label>
                  <Textarea
                    required
                    disabled={uploadingProj}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Short summary of what you did and reach metrics..."
                    rows={4}
                    className="bg-transparent text-white border border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px] w-full p-2 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.1em] text-[#7A7A7A] uppercase block">
                    Cover Image (Optional)
                  </label>
                  <input
                    ref={projFileInputRef}
                    type="file"
                    disabled={uploadingProj}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProjFile(e.target.files[0])
                      }
                    }}
                    className="text-white text-[12px] w-full p-2 border border-dashed border-[#2A2A2A] cursor-crosshair"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    disabled={uploadingProj}
                    checked={projFeatured}
                    onChange={(e) => setProjFeatured(e.target.checked)}
                    className="w-4 h-4 border border-[#2A2A2A] bg-black text-[#E60012] focus:ring-0 rounded-none cursor-crosshair"
                  />
                  <label
                    htmlFor="featured"
                    className="text-[12px] tracking-[0.05em] text-white cursor-crosshair uppercase"
                  >
                    Featured (Spans 2 Grid Columns)
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={uploadingProj}
                    className="w-full font-bold uppercase tracking-[0.12em] text-[13px] bg-[#E60012] text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none h-12"
                    style={{ cursor: 'crosshair' }}
                  >
                    {uploadingProj 
                      ? (editingProjId ? 'UPDATING...' : 'ADDING...') 
                      : (editingProjId ? 'SAVE CHANGES →' : 'ADD PROJECT →')}
                  </Button>

                  {editingProjId && (
                    <Button
                      type="button"
                      disabled={uploadingProj}
                      onClick={() => {
                        setProjInitials('')
                        setProjCat('')
                        setProjName('')
                        setProjDesc('')
                        setProjFeatured(false)
                        setProjFile(null)
                        setEditingProjId(null)
                        if (projFileInputRef.current) projFileInputRef.current.value = ''
                      }}
                      className="w-full font-bold uppercase tracking-[0.12em] text-[13px] bg-neutral-800 hover:bg-neutral-700 text-white transition-all duration-300 rounded-none h-10"
                      style={{ cursor: 'crosshair' }}
                    >
                      CANCEL EDIT
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              className="bg-[#0A0A0A] border-[#2A2A2A] text-white rounded-none p-6"
              style={{ border: '1px solid #2A2A2A' }}
            >
              <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <div>
                  <div className="text-[12px] tracking-[0.2em] text-[#E60012] mb-1">
                    PORTFOLIO WORK
                  </div>
                  <CardTitle className="font-['Bebas_Neue'] text-3xl tracking-[0.05em] uppercase">
                    Manage Project Grid ({projectItems.length})
                  </CardTitle>
                </div>
                <button
                  onClick={() => fetchProjects()}
                  className="text-[11px] tracking-[0.1em] border border-[#2A2A2A] hover:border-white px-3 py-1 transition-colors duration-200"
                >
                  REFRESH
                </button>
              </CardHeader>

              <CardContent className="p-0">
                {loadingProjects ? (
                  <div className="py-20 text-center text-[#7A7A7A] text-[13px]">
                    Loading projects database...
                  </div>
                ) : projectItems.length === 0 ? (
                  <div className="py-20 text-center text-[#7A7A7A] text-[13px] border border-dashed border-[#2A2A2A]">
                    No custom projects found. Create one in the left panel to populate here.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black border border-[#2A2A2A] gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#111111] border border-[#2A2A2A] flex-shrink-0 overflow-hidden flex items-center justify-center font-['Bebas_Neue'] text-[20px] text-[#E60012]">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              item.initials
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-[15px] font-bold text-white leading-tight">
                                {item.name}
                              </h4>
                              {item.featured && (
                                <span className="text-[9px] bg-[#E60012] text-white px-1.5 py-0.5 uppercase font-bold tracking-[0.05em]">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#7A7A7A] tracking-[0.05em] uppercase">
                              {item.cat}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end font-sans">
                          <span className="text-[11px] text-[#4A4A4A] hidden md:inline font-mono">
                            Added {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          
                          <button
                            onClick={() => handleStartEditProject(item)}
                            className="text-[11px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2 border border-[#2A2A2A] hover:border-[#4A4A4A] transition-all duration-300 font-bold"
                            style={{ cursor: 'crosshair' }}
                          >
                            EDIT
                          </button>

                          <button
                            onClick={() => handleDeleteProject(item.id, item.image_url)}
                            className="text-[11px] bg-[#E60012]/10 hover:bg-[#E60012] text-red-500 hover:text-white px-4 py-2 border border-red-900/50 transition-all duration-300 font-bold"
                            style={{ cursor: 'crosshair' }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </div>
  )
}
