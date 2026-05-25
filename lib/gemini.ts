import { prisma } from './prisma'

export async function suggestGifts(personId: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return 'Add a GEMINI_API_KEY to your .env file to enable AI suggestions.'

  const person = await prisma.person.findUnique({
    where: { id: personId },
    include: {
      giftIdeas: { select: { title: true } },
      givenGifts: { select: { title: true } },
    },
  })
  if (!person) return 'Person not found.'

  const alreadyPlanned = person.giftIdeas.map((g) => g.title).join(', ') || 'none'
  const alreadyGiven = person.givenGifts.map((g) => g.title).join(', ') || 'none'
  const interests = person.notes || 'no specific interests noted'

  const prompt = `Suggest exactly 5 gift ideas for ${person.name}.
Interests/notes: ${interests}.
Gifts already given: ${alreadyGiven}.
Gifts already planned: ${alreadyPlanned}.
Respond with a numbered list only, one gift per line, no explanations.`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  )

  if (!res.ok) return `Gemini API error: ${res.status} ${res.statusText}`

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No suggestions returned.'
}
