// GET  → returns all team members (sensitive fields stripped)
// POST → staff login: verify credentials, return member data

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

const PUBLIC_FIELDS = `
  id, name, role, category, image_url, linkedin_url, twitter_url,
  instagram_url, display_order, is_active, bio, location, skills,
  color, color_key, avatar_url, website_url, is_founder
`

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('team_members')
      .select(PUBLIC_FIELDS)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('[GET /api/team]', err)
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    // 1. Authenticate with actual Supabase Auth (auth.users)
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Invalid credentials. Please use your standard Stremini account.' }, { status: 401 })
    }

    // 2. Fetch their team member profile
    const supabaseAdmin = getAdminClient()
    const { data: member, error } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .ilike('email', email)
      .eq('is_active', true)
      .single()

    if (error || !member) {
      return NextResponse.json({ error: 'Logged in successfully, but no active team profile is linked to this email.' }, { status: 403 })
    }

    return NextResponse.json(member)
  } catch (err) {
    console.error('[POST /api/team]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
