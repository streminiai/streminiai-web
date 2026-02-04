import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Use placeholder values if env vars are not set (for development)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    'placeholder-key'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

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

export type BlogPost = {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    author: string
    featured_image_url: string | null
    tags: string[]
    is_published: boolean
    published_at: string | null
    created_at: string
    updated_at: string
}

export type SurveyStats = {
    averageRating: number
    totalResponses: number
    ratings: { stars: number; count: number; percentage: number }[]
    dailyUseIntent: { yes: number; no: number; maybe: number }
    onScreenAccessComfort: { yes: number; no: number; maybe: number }
    topFeedback: string[]
}

export type SiteSetting = {
    id: string
    key: string
    value: Record<string, unknown> | SurveyStats
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

export type UserRole = 'superadmin' | 'blog_editor' | 'team_editor' | 'waitlist_viewer'

export type UserRoleView = {
    user_id: string
    email: string
    roles: UserRole[] | null
    created_at: string | null
    updated_at: string | null
}

export async function getUserRole(): Promise<UserRole[] | null> {
    try {
        const { data, error } = await supabase
            .rpc('get_my_role')

        if (error) throw error
        return data as UserRole[]
    } catch (error) {
        console.error('Error fetching user role:', error)
        return null
    }
}

export async function getAllUserRoles(): Promise<UserRoleView[]> {
    try {
        const { data, error } = await supabase
            .rpc('get_all_user_roles')

        if (error) throw error
        return data as UserRoleView[]
    } catch (error) {
        console.error('Error fetching all user roles:', error)
        return []
    }
}

export async function updateUserRole(userId: string, roles: UserRole[]): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('user_roles')
            .upsert({ user_id: userId, roles, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating user role:', error)
        return false
    }
}

export async function addUserByEmail(email: string, roles: UserRole[]): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .rpc('add_user_role_by_email', {
                target_email: email,
                new_roles: roles
            })

        if (error) throw error
        return data as boolean
    } catch (error) {
        console.error('Error adding user by email:', error)
        throw error
    }
}

// Server-only administrative client
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase admin environment variables')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
