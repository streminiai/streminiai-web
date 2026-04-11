// PUT → update a member's profile (requires username + password for auth)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

const ALLOWED_FIELDS = [
  'name', 'bio', 'location',
  'twitter_url', 'linkedin_url', 'website_url', 'instagram_url',
  'skills', 'color_key', 'color', 'avatar_url', 'image_url',
]

const COLORS: Record<string, string> = {
  blue:   'linear-gradient(135deg,#0071e3,#34aadc)',
  purple: 'linear-gradient(135deg,#bf5af2,#9b59b6)',
  orange: 'linear-gradient(135deg,#ff9f0a,#ff6b35)',
  green:  'linear-gradient(135deg,#34c759,#30a14e)',
  red:    'linear-gradient(135deg,#ff3b30,#c0392b)',
  teal:   'linear-gradient(135deg,#5ac8fa,#0097a7)',
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { username, password, updates } = await req.json()

    if (!username || !password || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getAdminClient()

    // 1. Fetch current to ensure it exists
    const { data: member, error: fetchErr } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchErr || !member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (!member.is_active) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Auth: only the member themselves can update their profile
    if (member.username?.toLowerCase() !== username.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify password match for auth
    if (member.password !== password) {
      return NextResponse.json({ error: 'Unauthorized: Invalid password' }, { status: 401 })
    }

    // 2. Filter payload to only allowed fields
    const updatePayload: Record<string, unknown> = {}
    for (const field of ALLOWED_FIELDS) {
      if (updates[field] !== undefined) {
        updatePayload[field] = updates[field]
      }
    }

    // Sync color gradient from colorKey
    if (updates.color_key && COLORS[updates.color_key]) {
      updatePayload.color = COLORS[updates.color_key]
    }

    updatePayload.updated_at = new Date().toISOString()

    const { data: updated, error: updateErr } = await supabase
      .from('team_members')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (updateErr) throw updateErr

    // Return updated member without sensitive fields
    const safe = { ...updated }
    delete (safe as Record<string, unknown>).password
    return NextResponse.json(safe)
  } catch (err) {
    console.error('[PUT /api/team/[id]]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
