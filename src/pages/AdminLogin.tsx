import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/admin')
      }
    })
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data.session) {
        navigate('/admin')
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black p-6 font-['Space_Mono']"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #111111 0%, #000000 100%)',
      }}
    >
      {/* Back to Home Button */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault()
          navigate('/')
        }}
        className="absolute top-6 left-6 text-[12px] tracking-[0.1em] text-[#7A7A7A] hover:text-white no-underline transition-colors duration-200"
      >
        ← BACK TO SITE
      </a>

      <Card
        className="w-full max-w-[420px] bg-[#0A0A0A] text-white border-[#2A2A2A] rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        style={{ border: '1px solid #2A2A2A' }}
      >
        <CardHeader className="space-y-2 border-b border-[#2A2A2A] p-6 text-center">
          <div className="text-[12px] tracking-[0.25em] text-[#E60012] uppercase mb-1">
            SECURE ACCESS
          </div>
          <CardTitle className="font-['Bebas_Neue'] text-4xl tracking-[0.05em]">
            PORTFOLIO ADMIN
          </CardTitle>
          <CardDescription className="text-[#7A7A7A] text-[13px] font-sans">
            Enter your admin credentials to manage content.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 p-6">
            {error && (
              <div
                className="p-3 text-[13px] text-red-500 bg-red-950/20 border border-red-900/50"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                ERROR: {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                className="text-[12px] tracking-[0.1em] text-[#7A7A7A] uppercase block"
                htmlFor="email"
              >
                Admin Email
              </label>
              <Input
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-black text-white border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px]"
                style={{
                  border: 'none',
                  borderBottom: '1px solid #2A2A2A',
                  padding: '10px 0',
                  background: 'transparent',
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-[12px] tracking-[0.1em] text-[#7A7A7A] uppercase block"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-black text-white border-[#2A2A2A] rounded-none focus:border-[#E60012] focus:ring-0 text-[14px]"
                style={{
                  border: 'none',
                  borderBottom: '1px solid #2A2A2A',
                  padding: '10px 0',
                  background: 'transparent',
                }}
              />
            </div>
          </CardContent>

          <CardFooter className="p-6 border-t border-[#2A2A2A] flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-bold uppercase tracking-[0.12em] text-[13px] bg-[#E60012] hover:bg-white hover:text-black transition-all duration-300 rounded-none h-12"
              style={{ cursor: 'crosshair' }}
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN →'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
