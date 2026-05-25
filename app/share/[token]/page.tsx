import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'

type Props = { params: Promise<{ token: string }> }

export default async function SharePage({ params }: Props) {
  const { token } = await params
  const person = await prisma.person.findUnique({
    where: { shareToken: token },
    include: {
      giftIdeas: {
        where: { status: { not: 'GIVEN' } },
        include: { occasion: true, links: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!person) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gift ideas for {person.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Read-only view — no login required.</p>
      </div>

      {person.giftIdeas.length === 0 ? (
        <p className="text-muted-foreground">No gift ideas yet.</p>
      ) : (
        <div className="space-y-4">
          {person.giftIdeas.map((idea) => (
            <div key={idea.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{idea.title}</span>
                {idea.occasion && <Badge variant="outline">{idea.occasion.name}</Badge>}
                <StatusBadge status={idea.status} />
              </div>
              {idea.notes && <p className="text-sm text-muted-foreground">{idea.notes}</p>}
              {idea.imageUrl && (
                <img src={idea.imageUrl} alt={idea.title} className="h-24 object-cover rounded" />
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
          ))}
        </div>
      )}
    </div>
  )
}
