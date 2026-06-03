export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AIModal } from '@/components/AIModal'
import { ShareSection } from './ShareSection'
import { StatusBadge } from '@/components/StatusBadge'

type Props = { params: Promise<{ id: string }> }

export default async function PersonDetailPage({ params }: Props) {
  const { id } = await params
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      giftIdeas: {
        include: { occasion: true, links: true },
        orderBy: { createdAt: 'desc' },
      },
      givenGifts: {
        include: { occasion: true },
        orderBy: { givenDate: 'desc' },
      },
      events: { include: { occasion: true }, orderBy: { date: 'asc' } },
    },
  })
  if (!person) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{person.name}</h1>
          {person.birthday && (
            <p className="text-muted-foreground text-sm mt-1">
              🎂 {new Date(person.birthday).toLocaleDateString('de', { month: 'long', day: 'numeric' })}
            </p>
          )}
          {person.notes && <p className="text-sm mt-1 text-muted-foreground">{person.notes}</p>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/people/${id}/edit`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>Bearbeiten</Link>
          <Link href={`/people/${id}/ideas/new`} className={buttonVariants({ size: 'sm' })}>+ Idee</Link>
          <AIModal personId={id} />
        </div>
      </div>

      <ShareSection personId={id} shareToken={person.shareToken} />

      <Tabs defaultValue="ideas">
        <TabsList>
          <TabsTrigger value="ideas">Geschenkideen ({person.giftIdeas.filter(i => i.status !== 'GIVEN').length})</TabsTrigger>
          <TabsTrigger value="given">Vergangene Geschenke ({person.givenGifts.length})</TabsTrigger>
          <TabsTrigger value="events">Anlässe ({person.events.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="space-y-3 mt-4">
          {person.giftIdeas.filter(i => i.status !== 'GIVEN').length === 0 ? (
            <p className="text-muted-foreground">Noch keine Ideen.</p>
          ) : (
            person.giftIdeas.filter(i => i.status !== 'GIVEN').map((idea) => (
              <div key={idea.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{idea.title}</span>
                      {idea.occasion && <Badge variant="outline">{idea.occasion.name}</Badge>}
                    </div>
                    {idea.notes && <p className="text-sm text-muted-foreground">{idea.notes}</p>}
                    {idea.todoNotes && (
                      <p className="text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded">
                        📋 {idea.todoNotes}
                      </p>
                    )}
                    {idea.imageUrl && (
                      <img src={idea.imageUrl} alt={idea.title} className="h-24 object-cover rounded mt-1" />
                    )}
                    {idea.links.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {idea.links.map((l) => (
                          <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            {l.label || l.url}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={idea.status} />
                    <div className="flex gap-1">
                      <Link href={`/people/${id}/ideas/${idea.id}/edit`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Bearbeiten</Link>
                      <Link href={`/people/${id}/ideas/${idea.id}/promote`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Als überreicht markieren</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="given" className="space-y-3 mt-4">
          <Link href={`/people/${id}/given-gifts/new`} className={buttonVariants({ size: 'sm', variant: 'outline' })}>Geschenk direkt erfassen</Link>
          {person.givenGifts.length === 0 ? (
            <p className="text-muted-foreground">Noch keine Geschenke erfasst.</p>
          ) : (
            person.givenGifts.map((g) => (
              <div key={g.id} className="border rounded-lg p-4 flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="font-medium">{g.title}</span>
                  {g.occasion && <Badge variant="outline" className="ml-2">{g.occasion.name}</Badge>}
                  <p className="text-sm text-muted-foreground">
                    Überreicht am {new Date(g.givenDate).toLocaleDateString('de')}
                  </p>
                  {g.notes && <p className="text-sm text-muted-foreground">{g.notes}</p>}
                </div>
                {g.imageUrl && (
                  <img src={g.imageUrl} alt={g.title} className="h-16 object-cover rounded" />
                )}
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-3 mt-4">
          <Link href={`/people/${id}/occasions/new`} className={buttonVariants({ size: 'sm', variant: 'outline' })}>Anlass hinzufügen</Link>
          {person.events.length === 0 ? (
            <p className="text-muted-foreground">Keine eigenen Anlässe.</p>
          ) : (
            person.events.map((ev) => (
              <div key={ev.id} className="border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{ev.occasion.name}</span>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ev.date).toLocaleDateString('de')}
                  </p>
                  {ev.notes && <p className="text-sm text-muted-foreground">{ev.notes}</p>}
                </div>
                <Link href={`/people/${id}/occasions/${ev.id}/edit`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Bearbeiten</Link>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
