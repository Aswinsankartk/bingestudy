import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Get all members of a group
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: members, error } = await supabase
    .from('group_members')
    .select('id, role, joined_at, user_id')
    .eq('group_id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ members })
}

// Update member role or remove member
export async function PATCH(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if the requester is an admin
  const { data: requester } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!requester || requester.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can do this' }, { status: 403 })
  }

  const { targetUserId, action } = await request.json()

  // Prevent acting on yourself
  if (targetUserId === user.id) {
    return NextResponse.json({ error: 'You cannot modify your own role' }, { status: 400 })
  }

  if (action === 'remove') {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', params.id)
      .eq('user_id', targetUserId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Member removed' })
  }

  if (action === 'make_admin') {
    const { error } = await supabase
      .from('group_members')
      .update({ role: 'admin' })
      .eq('group_id', params.id)
      .eq('user_id', targetUserId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Member promoted to admin' })
  }

  if (action === 'remove_admin') {
    const { error } = await supabase
      .from('group_members')
      .update({ role: 'member' })
      .eq('group_id', params.id)
      .eq('user_id', targetUserId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Admin role removed' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}