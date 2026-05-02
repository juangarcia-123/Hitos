import { generateText, Output } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

const RecommendationsSchema = z.object({
  activities: z.array(z.object({
    title: z.string().describe('Título corto de la actividad (máx 50 caracteres)'),
    description: z.string().describe('Descripción breve de cómo realizar la actividad (máx 150 caracteres)'),
    category: z.enum(['motor_grueso', 'motor_fino', 'lenguaje', 'social_cognitivo', 'biologico']),
    duration: z.string().describe('Duración aproximada (ej: "5-10 min")'),
    materials: z.array(z.string()).describe('Materiales necesarios (vacío si no requiere nada especial)'),
  })).describe('3 actividades de estimulación personalizadas'),
  nextMilestones: z.array(z.object({
    name: z.string(),
    category: z.string(),
    tip: z.string().describe('Un consejo práctico para ayudar a alcanzar este hito'),
  })).describe('2-3 hitos próximos a trabajar'),
  encouragement: z.string().describe('Mensaje de aliento personalizado para el cuidador (1-2 oraciones)'),
})

export async function POST(req: Request) {
  const supabase = await createClient()
  
  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { childId } = await req.json()
  
  if (!childId) {
    return Response.json({ error: 'childId is required' }, { status: 400 })
  }

  // Get child info
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('name, birth_date, gender')
    .eq('id', childId)
    .eq('user_id', user.id)
    .single()

  if (childError || !child) {
    return Response.json({ error: 'Child not found' }, { status: 404 })
  }

  // Calculate age in months
  const birthDate = new Date(child.birth_date)
  const now = new Date()
  const ageMonths = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))

  // Get completed milestones
  const { data: completedMilestones } = await supabase
    .from('milestone_progress')
    .select(`
      milestones (
        name,
        category
      )
    `)
    .eq('child_id', childId)
    .eq('status', 'achieved')
    .limit(15)

  // Get expected milestones for this age that haven't been completed
  const { data: pendingMilestones } = await supabase
    .from('milestones')
    .select('id, name, category, min_age_months, max_age_months, description')
    .lte('min_age_months', ageMonths + 3)
    .gte('max_age_months', ageMonths - 1)
    .limit(10)

  // Filter out completed milestones
  const completedIds = new Set(
    completedMilestones
      ?.map(p => (p.milestones as { name: string })?.name)
      .filter(Boolean) || []
  )
  
  const upcomingMilestones = pendingMilestones?.filter(
    m => !completedIds.has(m.name)
  ) || []

  // Build context for AI
  const completedText = completedMilestones
    ?.filter(p => p.milestones)
    .map(p => {
      const m = p.milestones as { name: string; category: string }
      return `- ${m.name} (${m.category})`
    })
    .join('\n') || 'Ninguno registrado aún'

  const upcomingText = upcomingMilestones
    .map(m => `- ${m.name} (${m.category}, ${m.min_age_months}-${m.max_age_months} meses): ${m.description || ''}`)
    .join('\n') || 'No hay hitos pendientes'

  const prompt = `Genera recomendaciones personalizadas de estimulación para un niño con las siguientes características:

## Información del niño:
- Nombre: ${child.name}
- Edad: ${ageMonths} meses
- Género: ${child.gender || 'No especificado'}

## Hitos ya completados:
${completedText}

## Hitos próximos esperados:
${upcomingText}

## Instrucciones:
1. Sugiere 3 actividades de estimulación apropiadas para su edad que ayuden a desarrollar habilidades en diferentes áreas
2. Las actividades deben ser prácticas, realizables en casa con materiales simples
3. Identifica 2-3 hitos próximos más importantes a trabajar
4. Incluye un mensaje de aliento personalizado para los cuidadores

Responde en español neutro latinoamericano.`

  try {
    const result = await generateText({
      model: 'anthropic/claude-sonnet-4',
      prompt,
      output: Output.object({ schema: RecommendationsSchema }),
      maxTokens: 1024,
    })

    return Response.json({
      recommendations: result.object,
      childAge: ageMonths,
      childName: child.name,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return Response.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
