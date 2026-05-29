import { prisma } from './prisma'

export async function suggestGifts(personId: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return 'Füge einen GEMINI_API_KEY zu deiner .env-Datei hinzu, um KI-Vorschläge zu aktivieren.'

  const person = await prisma.person.findUnique({
    where: { id: personId },
    include: {
      giftIdeas: { select: { title: true } },
      givenGifts: { select: { title: true } },
    },
  })
  if (!person) return 'Person nicht gefunden.'

  const alreadyPlanned = person.giftIdeas.map((g) => g.title).join(', ') || 'keine'
  const alreadyGiven = person.givenGifts.map((g) => g.title).join(', ') || 'keine'
  const interests = person.notes || 'keine Interessen angegeben'

  const prompt = `Schlage genau 5 Geschenkideen für ${person.name} vor.
Interessen/Notizen: ${interests}.
Bereits verschenkte Geschenke: ${alreadyGiven}.
Bereits geplante Geschenke: ${alreadyPlanned}.
Antworte ausschließlich mit einer nummerierten Liste, ein Geschenk pro Zeile, ohne Erklärungen. Antworte auf Deutsch.`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  )

  if (!res.ok) return `Gemini API Fehler: ${res.status} ${res.statusText}`

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Keine Vorschläge erhalten.'
}
