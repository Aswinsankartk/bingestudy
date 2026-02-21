import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Generate a random 6 character invite code
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Create a new group
export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, subject } = await request.json()

  if (!name) {
    return NextResponse.json({ error: 'Group name is required' }, { status: 400 })
  }

  const code = generateCode()

  // Insert the group
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({ name, subject, code, created_by: user.id })
    .select()
    .single()

  if (groupError) {
    return NextResponse.json({ error: groupError.message }, { status: 500 })
  }

  // Add creator as admin
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: user.id, role: 'admin' })

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 })
  }

  return NextResponse.json({ group }, { status: 201 })
}

// Get all groups for the logged in user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: memberships, error } = await supabase
    .from('group_members')
    .select('role, groups(id, name, subject, code, created_at)')
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ memberships })
}