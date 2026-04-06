// GET  → returns all team members (sensitive fields stripped)
// POST → staff login: verify credentials, return member data

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

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
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { data: member, error } = await supabase
      .from('team_members')
      .select('*')
      .ilike('username', username)
      .eq('is_active', true)
      .single()

    if (error || !member) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const valid = await bcrypt.compare(password, member.password_hash ?? '')
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Strip sensitive fields
    const safe = { ...member }
    delete (safe as Record<string, unknown>).password_hash
    return NextResponse.json(safe)
  } catch (err) {
    console.error('[POST /api/team]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
