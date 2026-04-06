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
    const { email, password, updates } = await req.json()

    if (!email || !password || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
      return NextResponse.json({ error: 'Unauthorized: Invalid credentials.' }, { status: 401 })
    }

    const supabaseAdmin = getAdminClient()

    // 1.5 Verify the logged-in email matches the profile they are trying to update
    const { data: currentMember, error: fetchErr } = await supabaseAdmin
      .from('team_members')
      .select('email')
      .eq('id', id)
      .single()

    if (fetchErr || !currentMember) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (currentMember.email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized: You can only edit your own profile.' }, { status: 403 })
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

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('team_members')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (updateErr) throw updateErr

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/team/[id]]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
