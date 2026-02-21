import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const groupId = formData.get('groupId')

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Check file size — max 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size must be under 10MB' }, { status: 400 })
  }

  // Determine file type
  const mimeType = file.type
  let type = 'doc'
  if (mimeType.startsWith('image/')) type = 'image'
  else if (mimeType === 'application/pdf') type = 'pdf'
  else if (mimeType.startsWith('audio/')) type = 'audio'

  // Create unique file name
  const extension = file.name.split('.').pop()
  const fileName = `${groupId}/${Date.now()}.${extension}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('group-files')
    .upload(fileName, file, { contentType: mimeType })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('group-files')
    .getPublicUrl(fileName)

  // Save message to database
  const { error: msgError } = await supabase.from('messages').insert({
    group_id: groupId,
    sender_id: user.id,
    type,
    content: file.name,
    file_url: publicUrl
  })

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 })
  }

  return NextResponse.json({ publicUrl, type })
}