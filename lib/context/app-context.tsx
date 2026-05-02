'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  clerk_id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  relationship: string
  notification_email: boolean
  notification_push: boolean
  notification_weekly_summary: boolean
  language: string
  timezone: string
}

interface Child {
  id: string
  name: string
  birth_date: string
  gender: string | null
  avatar_url: string | null
  birth_weight_kg: number | null
  birth_height_cm: number | null
  blood_type: string | null
  is_premature: boolean
  premature_weeks: number | null
  notes: string | null
  child_medical_info?: {
    pediatrician_name: string | null
    pediatrician_phone: string | null
    pediatrician_clinic: string | null
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
    emergency_contact_relationship: string | null
    insurance_provider: string | null
    insurance_number: string | null
  } | null
  allergies?: Array<{
    id: string
    name: string
    severity: string
    reaction: string | null
    notes: string | null
  }>
  conditions?: Array<{
    id: string
    name: string
    diagnosed_date: string | null
    status: string
    treating_doctor: string | null
    notes: string | null
  }>
  medications?: Array<{
    id: string
    name: string
    dosage: string | null
    frequency: string | null
    is_active: boolean
  }>
  vaccines?: Array<{
    id: string
    name: string
    date_administered: string
    dose_number: number
  }>
  growth_records?: Array<{
    id: string
    date: string
    weight_kg: number | null
    height_cm: number | null
    head_circumference_cm: number | null
  }>
}

interface AppContextType {
  clerkId: string | null
  profile: Profile | null
  children: Child[]
  selectedChild: Child | null
  isLoading: boolean
  selectChild: (childId: string) => void
  refreshChildren: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children: childrenProp }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()
  const clerkId = clerkUser?.id ?? null

  const refreshProfile = useCallback(async () => {
    if (!clerkId) return

    // First try to get existing profile
    let { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    // If no profile exists, create one
    if (!data && clerkUser) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          clerk_id: clerkId,
          email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
          full_name: clerkUser.fullName ?? null,
          avatar_url: clerkUser.imageUrl ?? null,
        })
        .select()
        .single()
      
      data = newProfile
    }

    if (data) {
      setProfile(data)
    }
  }, [supabase, clerkId, clerkUser])

  const refreshChildren = useCallback(async () => {
    if (!profile?.id) return

    const { data } = await supabase
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
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })

    if (data) {
      setChildren(data)
      
      // Auto-select first child if none selected
      if (!selectedChildId && data.length > 0) {
        setSelectedChildId(data[0].id)
      }
    }
  }, [supabase, profile?.id, selectedChildId])

  // Initialize when Clerk is loaded
  useEffect(() => {
    const init = async () => {
      if (!isClerkLoaded) return
      
      setIsLoading(true)
      
      if (clerkId) {
        await refreshProfile()
      } else {
        setProfile(null)
        setChildren([])
        setSelectedChildId(null)
      }
      
      setIsLoading(false)
    }

    init()
  }, [isClerkLoaded, clerkId, refreshProfile])

  // Fetch children when profile is loaded
  useEffect(() => {
    if (profile?.id) {
      refreshChildren()
    }
  }, [profile?.id, refreshChildren])

  const selectChild = (childId: string) => {
    setSelectedChildId(childId)
    // Persist selection in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedChildId', childId)
    }
  }

  // Restore selection from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && children.length > 0) {
      const saved = localStorage.getItem('selectedChildId')
      if (saved && children.some(c => c.id === saved)) {
        setSelectedChildId(saved)
      }
    }
  }, [children])

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0] || null

  return (
    <AppContext.Provider value={{
      clerkId,
      profile,
      children,
      selectedChild,
      isLoading,
      selectChild,
      refreshChildren,
      refreshProfile,
    }}>
      {childrenProp}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
