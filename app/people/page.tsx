export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button'

export default async function PeoplePage() {
  const people = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { giftIdeas: true, givenGifts: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personen</h1>
        <Link href="/people/new" className={buttonVariants()}>Person hinzufügen</Link>
      </div>

      {people.length === 0 ? (
        <p className="text-muted-foreground">Noch keine Personen.</p>
      ) : (
        <div className="divide-y border rounded-lg">
          {people.map((p) => (
            <Link key={p.id} href={`/people/${p.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium">{p.name}</p>
                {p.birthday && (
                  <p className="text-sm text-muted-foreground">
                    🎂 {new Date(p.birthday).toLocaleDateString('de', { month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="text-sm text-muted-foreground text-right">
                <p>{p._count.giftIdeas} Ideen</p>
                <p>{p._count.givenGifts} überreicht</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
