import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code } = await request.json()

  if (!code) {
    return NextResponse.json({ error: 'Invite code is required' }, { status: 400 })
  }

  // Find the group by code
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (groupError || !group) {
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
  }

  // Check if user is already a member
  const { data: existing } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', group.id)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You are already in this group' }, { status: 400 })
  }

  // Add user as member
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: user.id, role: 'member' })

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 })
  }

  const posthog = getPostHogClient()
  posthog.capture({
    distinctId: user.id,
    event: 'group_joined_server',
    properties: { group_id: group.id, group_name: group.name },
  })

  return NextResponse.json({ group })
}