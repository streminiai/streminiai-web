import { createClient } from '@supabase/supabase-js'

// Use placeholder values if env vars are not set (for development)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)
)

// Types
export type WaitlistEntry = {
    id: string
    email: string
    name: string | null
    status: 'pending' | 'approved' | 'removed'
    source: string
    created_at: string
    approved_at: string | null
    notes: string | null
}

export type TeamMember = {
    id: string
    name: string
    role: string | null
    category: 'founder' | 'co-founder' | 'developer' | 'marketing' | 'research'
    image_url: string | null
    linkedin_url: string | null
    twitter_url: string | null
    instagram_url: string | null
    display_order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export const categoryLabels: Record<TeamMember['category'], string> = {
    'founder': 'Founder',
    'co-founder': 'Co-Founders',
    'developer': 'Developers Team',
    'marketing': 'Marketing Team',
    'research': 'Research & Operations',
}
