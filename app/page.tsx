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
        _count: { select: { giftIdeas: true, givenGifts: true } },
      },
    }),
    getNotifications(),
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/people/new" className={buttonVariants()}>Add Person</Link>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Upcoming occasions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.map((n, i) => (
              <Link key={i} href={`/people/${n.personId}`}>
                <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{n.personName}</span>
                    <span className="text-sm text-muted-foreground">
                      {n.occasionName} &mdash;{' '}
                      {n.daysUntil === 0 ? 'Today!' : `${n.daysUntil}d`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {n.giftIdeas.length} idea{n.giftIdeas.length !== 1 ? 's' : ''} planned
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">People</h2>
        {people.length === 0 ? (
          <p className="text-muted-foreground">
            No people yet.{' '}
            <Link href="/people/new" className="underline">
              Add someone
            </Link>{' '}
            to get started.
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
                          {new Date(p.birthday).toLocaleDateString('en', {
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      <p>
                        {p._count.giftIdeas} idea{p._count.giftIdeas !== 1 ? 's' : ''} &middot;{' '}
                        {p._count.givenGifts} given
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
