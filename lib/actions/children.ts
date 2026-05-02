'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getChildren() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data: children, error } = await supabase
    .from('children')
    .select(`
      *,
      child_medical_info(*),
      allergies(*),
      conditions(*),
      medications(*),
      vaccines(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching children:', error)
    return []
  }

  return children || []
}

export async function getChild(childId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: child, error } = await supabase
    .from('children')
    .select(`
      *,
      child_medical_info(*),
      allergies(*),
      conditions(*),
      medications(*),
      vaccines(*),
      growth_records(*)
    `)
    .eq('id', childId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching child:', error)
    return null
  }

  return child
}

export async function createChild(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No autenticado' }
  }

  const childData = {
    user_id: user.id,
    name: formData.get('name') as string,
    birth_date: formData.get('birthDate') as string,
    gender: formData.get('gender') as string,
    birth_weight_kg: formData.get('birthWeight') ? parseFloat(formData.get('birthWeight') as string) : null,
    birth_height_cm: formData.get('birthHeight') ? parseFloat(formData.get('birthHeight') as string) : null,
    blood_type: formData.get('bloodType') as string || null,
    is_premature: formData.get('isPremature') === 'true',
    premature_weeks: formData.get('prematureWeeks') ? parseInt(formData.get('prematureWeeks') as string) : null,
    notes: formData.get('notes') as string || null,
  }

  const { data: child, error } = await supabase
    .from('children')
    .insert(childData)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Create empty medical info record
  await supabase
    .from('child_medical_info')
    .insert({ child_id: child.id })

  revalidatePath('/')
  redirect(`/children/${child.id}`)
}

export async function updateChild(childId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No autenticado' }
  }

  const updates = {
    name: formData.get('name') as string,
    birth_date: formData.get('birthDate') as string,
    gender: formData.get('gender') as string,
    birth_weight_kg: formData.get('birthWeight') ? parseFloat(formData.get('birthWeight') as string) : null,
    birth_height_cm: formData.get('birthHeight') ? parseFloat(formData.get('birthHeight') as string) : null,
    blood_type: formData.get('bloodType') as string || null,
    is_premature: formData.get('isPremature') === 'true',
    premature_weeks: formData.get('prematureWeeks') ? parseInt(formData.get('prematureWeeks') as string) : null,
    notes: formData.get('notes') as string || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('children')
    .update(updates)
    .eq('id', childId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/children/${childId}`)
  return { success: true }
}

export async function deleteChild(childId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No autenticado' }
  }

  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  redirect('/')
}

// Medical info actions
export async function updateMedicalInfo(childId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No autenticado' }
  }

  const updates = {
    pediatrician_name: formData.get('pediatricianName') as string || null,
    pediatrician_phone: formData.get('pediatricianPhone') as string || null,
    pediatrician_clinic: formData.get('pediatricianClinic') as string || null,
    emergency_contact_name: formData.get('emergencyContactName') as string || null,
    emergency_contact_phone: formData.get('emergencyContactPhone') as string || null,
    emergency_contact_relationship: formData.get('emergencyContactRelationship') as string || null,
    insurance_provider: formData.get('insuranceProvider') as string || null,
    insurance_number: formData.get('insuranceNumber') as string || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('child_medical_info')
    .upsert({ child_id: childId, ...updates })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/children/${childId}`)
  return { success: true }
}

// Allergy actions
export async function addAllergy(childId: string, formData: FormData) {
  const supabase = await createClient()
  
  const allergyData = {
    child_id: childId,
    name: formData.get('name') as string,
    severity: formData.get('severity') as string || 'leve',
    reaction: formData.get('reaction') as string || null,
    notes: formData.get('notes') as string || null,
  }

  const { error } = await supabase
    .from('allergies')
    .insert(allergyData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/children/${childId}`)
  return { success: true }
}

export async function deleteAllergy(allergyId: string, childId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('allergies')
    .delete()
    .eq('id', allergyId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/children/${childId}`)
  return { success: true }
}

// Growth record actions
export async function addGrowthRecord(childId: string, formData: FormData) {
  const supabase = await createClient()
  
  const recordData = {
    child_id: childId,
    date: formData.get('date') as string,
    weight_kg: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
    height_cm: formData.get('height') ? parseFloat(formData.get('height') as string) : null,
    head_circumference_cm: formData.get('headCircumference') ? parseFloat(formData.get('headCircumference') as string) : null,
    notes: formData.get('notes') as string || null,
  }

  const { error } = await supabase
    .from('growth_records')
    .insert(recordData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/children/${childId}`)
  return { success: true }
}
