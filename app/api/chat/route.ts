import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

// System prompt for Hitos - child development assistant
const HITOS_SYSTEM_PROMPT = `Eres un asistente especializado en desarrollo infantil llamado Hitos. Tu rol es ayudar a padres, madres y cuidadores a comprender y acompañar el desarrollo de niños de 0 a 5 años.

## Principios fundamentales:

1. **Nunca diagnosticar**: No eres un profesional de la salud. No puedes diagnosticar condiciones, trastornos o enfermedades.

2. **No alarmar**: Usa un tono cálido, empático y tranquilizador. Evita frases alarmistas.

3. **Orientar, no confirmar**: Puedes explicar hitos del desarrollo, sugerir actividades de estimulación y recomendar cuándo consultar a un profesional, pero nunca confirmes ni descartes problemas de desarrollo.

4. **Respetar la diversidad**: Cada niño tiene su propio ritmo. Los rangos de edad para los hitos son orientativos.

5. **Lenguaje accesible**: Usa español neutro latinoamericano, evita tecnicismos innecesarios.

## Capacidades:

- Explicar hitos del desarrollo (motor grueso, motor fino, lenguaje, social/cognitivo, biológico)
- Sugerir actividades de estimulación apropiadas para la edad
- Responder dudas sobre alimentación, sueño, juego y rutinas
- Orientar sobre cuándo es conveniente consultar con un pediatra o especialista
- Celebrar los logros y avances del niño

## Restricciones:

- NO des diagnósticos médicos
- NO uses frases como "tu hijo tiene", "esto indica que", "es seguro que"
- NO recomiendes medicamentos ni tratamientos
- NO minimices preocupaciones legítimas de los padres
- NO generes contenido sobre maltrato, negligencia o situaciones de riesgo

## Formato de respuestas:

- Sé conciso pero completo
- Usa listas cuando sea útil
- Incluye ejemplos prácticos cuando sea relevante
- Siempre cierra con una nota de apoyo o una invitación a seguir conversando

Recuerda: Tu objetivo es acompañar, educar y tranquilizar. Si tienes dudas sobre algo, siempre recomienda consultar con un profesional de la salud.`

export async function POST(req: Request) {
  const supabase = await createClient()
  
  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, childId }: { messages: UIMessage[]; childId?: string } = await req.json()

  // Get child context if childId is provided
  let childContext = ''
  if (childId) {
    // Get child basic info
    const { data: child } = await supabase
      .from('children')
      .select('name, birth_date, gender')
      .eq('id', childId)
      .eq('user_id', user.id)
      .single()

    if (child) {
      const birthDate = new Date(child.birth_date)
      const now = new Date()
      const ageMonths = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
      const years = Math.floor(ageMonths / 12)
      const months = ageMonths % 12
      const ageText = years > 0 
        ? `${years} año${years > 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`
        : `${months} mes${months !== 1 ? 'es' : ''}`

      childContext = `\n\n## Contexto del niño:\n- Nombre: ${child.name}\n- Edad: ${ageText} (${ageMonths} meses)\n- Género: ${child.gender || 'No especificado'}`

      // Get completed milestones
      const { data: progress } = await supabase
        .from('milestone_progress')
        .select(`
          completed_at,
          milestones (
            name,
            category,
            min_age_months,
            max_age_months
          )
        `)
        .eq('child_id', childId)
        .eq('status', 'achieved')
        .order('completed_at', { ascending: false })
        .limit(10)

      if (progress && progress.length > 0) {
        const milestonesText = progress
          .filter(p => p.milestones)
          .map(p => {
            const m = p.milestones as { name: string; category: string }
            return `- ${m.name} (${m.category})`
          })
          .join('\n')
        
        if (milestonesText) {
          childContext += `\n\n### Hitos recientes logrados:\n${milestonesText}`
        }
      }

      // Get expected milestones for this age
      const { data: expectedMilestones } = await supabase
        .from('milestones')
        .select('name, category, min_age_months, max_age_months')
        .lte('min_age_months', ageMonths + 2)
        .gte('max_age_months', ageMonths - 1)
        .limit(10)

      if (expectedMilestones && expectedMilestones.length > 0) {
        const expectedText = expectedMilestones
          .map(m => `- ${m.name} (${m.category}, ${m.min_age_months}-${m.max_age_months} meses)`)
          .join('\n')
        
        childContext += `\n\n### Hitos esperados para esta edad:\n${expectedText}`
      }
    }
  }

  const systemPrompt = childContext 
    ? HITOS_SYSTEM_PROMPT + childContext 
    : HITOS_SYSTEM_PROMPT

  const result = streamText({
    model: 'anthropic/claude-sonnet-4',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
    maxTokens: 1024,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: allMessages, isAborted }) => {
      if (isAborted) return
      
      // TODO: Persist conversation to database
      // This would save to chat_conversations and chat_messages tables
    },
    consumeSseStream: consumeStream,
  })
}
