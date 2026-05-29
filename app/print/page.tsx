export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { PrintButton } from './PrintButton'

export default async function PrintPage() {
  const people = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: {
      giftIdeas: {
        include: { occasion: true },
        orderBy: { createdAt: 'desc' },
      },
      givenGifts: {
        include: { occasion: true },
        orderBy: { givenDate: 'desc' },
      },
    },
  })

  return (
    <div>
      <div className="print:hidden mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Drucken / Exportieren</h1>
        <PrintButton />
      </div>

      <div className="space-y-8">
        {people.map((person) => (
          <section key={person.id} className="break-inside-avoid">
            <h2 className="text-xl font-bold border-b pb-1 mb-3">{person.name}</h2>

            {person.giftIdeas.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">Geschenkideen</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="pb-1 pr-4">Titel</th>
                      <th className="pb-1 pr-4">Anlass</th>
                      <th className="pb-1">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {person.giftIdeas.map((idea) => (
                      <tr key={idea.id}>
                        <td className="py-1 pr-4">{idea.title}</td>
                        <td className="py-1 pr-4 text-muted-foreground">{idea.occasion?.name ?? '—'}</td>
                        <td className="py-1">{idea.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {person.givenGifts.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">Vergangene Geschenke</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="pb-1 pr-4">Titel</th>
                      <th className="pb-1 pr-4">Anlass</th>
                      <th className="pb-1">Datum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {person.givenGifts.map((g) => (
                      <tr key={g.id}>
                        <td className="py-1 pr-4">{g.title}</td>
                        <td className="py-1 pr-4 text-muted-foreground">{g.occasion?.name ?? '—'}</td>
                        <td className="py-1">{new Date(g.givenDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {person.giftIdeas.length === 0 && person.givenGifts.length === 0 && (
              <p className="text-sm text-muted-foreground">Keine Geschenke erfasst.</p>
            )}
          </section>
        ))}
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          nav { display: none !important; }
          main { padding: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  )
}
