'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMilestoneRecords(childId: string) {
  const supabase = await createClient()
  
  const { data: records, error } = await supabase
    .from('milestone_records')
    .select('*')
    .eq('child_id', childId)
    .order('achieved_date', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Error fetching milestone records:', error)
    return []
  }

  return records || []
}

export async function toggleMilestone(
  childId: string, 
  milestoneId: string, 
  category: string,
  currentStatus: string
) {
  const supabase = await createClient()
  
  const newStatus = currentStatus === 'achieved' ? 'pending' : 'achieved'
  const achievedDate = newStatus === 'achieved' ? new Date().toISOString().split('T')[0] : null

  const { error } = await supabase
    .from('milestone_records')
    .upsert({
      child_id: childId,
      milestone_id: milestoneId,
      category,
      status: newStatus,
      achieved_date: achievedDate,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'child_id,milestone_id'
    })

  if (error) {
    console.error('Error toggling milestone:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/milestones')
  return { success: true, newStatus }
}

export async function updateMilestoneNote(
  childId: string,
  milestoneId: string,
  category: string,
  notes: string
) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('milestone_records')
    .upsert({
      child_id: childId,
      milestone_id: milestoneId,
      category,
      notes,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'child_id,milestone_id'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/children/${childId}`)
  return { success: true }
}

export async function addMilestoneEvidence(
  childId: string,
  milestoneId: string,
  category: string,
  evidenceUrl: string
) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('milestone_records')
    .upsert({
      child_id: childId,
      milestone_id: milestoneId,
      category,
      evidence_url: evidenceUrl,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'child_id,milestone_id'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/children/${childId}`)
  return { success: true }
}

export async function getMilestoneStats(childId: string) {
  const supabase = await createClient()
  
  const { data: records, error } = await supabase
    .from('milestone_records')
    .select('category, status')
    .eq('child_id', childId)

  if (error) {
    console.error('Error fetching milestone stats:', error)
    return { total: 0, achieved: 0, byCategory: {} }
  }

  const achieved = records?.filter(r => r.status === 'achieved').length || 0
  const byCategory: Record<string, { total: number; achieved: number }> = {}
  
  records?.forEach(r => {
    if (!byCategory[r.category]) {
      byCategory[r.category] = { total: 0, achieved: 0 }
    }
    byCategory[r.category].total++
    if (r.status === 'achieved') {
      byCategory[r.category].achieved++
    }
  })

  return {
    total: records?.length || 0,
    achieved,
    byCategory
  }
}
