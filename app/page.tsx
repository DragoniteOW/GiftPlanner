export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { getNotifications } from '@/lib/notifications'

export default async function DashboardPage() {
  const [people, upcoming] = await Promise.all([
    prisma.person.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { giftIdeas: { where: { status: { not: 'GIVEN' } } }, givenGifts: true } },
      },
    }),
    getNotifications(),
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Übersicht</h1>
        <Link href="/people/new" className={buttonVariants()}>Person hinzufügen</Link>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Bevorstehende Anlässe</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.map((n, i) => (
              <Link key={i} href={`/people/${n.personId}`}>
                <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{n.personName}</span>
                    <span className="text-sm text-muted-foreground">
                      {n.occasionName} &mdash;{' '}
                      {n.daysUntil === 0 ? 'Heute!' : `${n.daysUntil} ${n.daysUntil === 1 ? 'Tag' : 'Tage'}`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {n.giftIdeas.length} Idee{n.giftIdeas.length !== 1 ? 'n' : ''} geplant
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">Personen</h2>
        {people.length === 0 ? (
          <p className="text-muted-foreground">
            Noch keine Personen.{' '}
            <Link href="/people/new" className="underline">
              Person hinzufügen
            </Link>{' '}
            um loszulegen.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((p) => (
              <Link key={p.id} href={`/people/${p.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {p.birthday && (
                        <p>
                          🎂{' '}
                          {new Date(p.birthday).toLocaleDateString('de', {
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      <p>
                        {p._count.giftIdeas} Idee{p._count.giftIdeas !== 1 ? 'n' : ''} &middot;{' '}
                        {p._count.givenGifts} überreicht
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
