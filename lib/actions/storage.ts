'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadFile(
  bucket: 'avatars' | 'child-media' | 'milestone-evidence',
  file: File,
  path: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No autenticado' }
  }

  // Path format: userId/childId/filename or userId/filename
  const fullPath = `${user.id}/${path}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fullPath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    return { error: error.message }
  }

  // Get public URL for avatars bucket (public) or signed URL for private buckets
  let url: string
  if (bucket === 'avatars') {
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)
    url = publicUrl.publicUrl
  } else {
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, 60 * 60 * 24 * 365) // 1 year
    
    if (urlError) {
      return { error: urlError.message }
    }
    url = signedUrl.signedUrl
  }

  return { success: true, url, path: data.path }
}

export async function deleteFile(
  bucket: 'avatars' | 'child-media' | 'milestone-evidence',
  path: string
) {
  const supabase = await createClient()
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function saveMediaUpload(
  childId: string,
  fileUrl: string,
  fileType: 'image' | 'video',
  fileName: string,
  fileSize: number,
  caption?: string,
  milestoneId?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No autenticado' }
  }

  const { data, error } = await supabase
    .from('media_uploads')
    .insert({
      child_id: childId,
      user_id: user.id,
      file_url: fileUrl,
      file_type: fileType,
      file_name: fileName,
      file_size: fileSize,
      caption,
      milestone_id: milestoneId,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/children/${childId}`)
  return { success: true, data }
}

export async function getMediaUploads(childId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('media_uploads')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching media:', error)
    return []
  }

  return data || []
}

export async function updateMediaAnalysis(mediaId: string, analysis: object) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('media_uploads')
    .update({ ai_analysis: analysis })
    .eq('id', mediaId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
