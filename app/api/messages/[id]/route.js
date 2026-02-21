import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Get the message
  const { data: message, error: fetchError } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !message) {
    return NextResponse.json({ error: 'Message not found', id, fetchError }, { status: 404 })
  }

  // Check if user is the sender or an admin
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', message.group_id)
    .eq('user_id', user.id)
    .single()

  const isAdmin = membership?.role === 'admin'
  const isSender = message.sender_id === user.id

  if (!isAdmin && !isSender) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  // Soft delete
  const { error: updateError } = await supabase
    .from('messages')
    .update({ is_deleted: true })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Message deleted' })
}