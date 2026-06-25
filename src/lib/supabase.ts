import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hepgzflutffnmvdzcjkn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tafJ0cYkYFyDG4030m9dMQ_nCebg1P_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
