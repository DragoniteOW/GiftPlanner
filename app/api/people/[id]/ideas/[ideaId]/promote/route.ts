import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; ideaId: string }> }) {
  const { id: personId, ideaId } = await params
  const { givenDate, occasionId, notes } = await req.json()

  const idea = await prisma.giftIdea.findUnique({ where: { id: ideaId } })
  if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 })

  const [givenGift] = await prisma.$transaction([
    prisma.givenGift.create({
      data: {
        personId,
        title: idea.title,
        notes: notes?.trim() || idea.notes,
        imageUrl: idea.imageUrl,
        givenDate: givenDate ? new Date(givenDate) : new Date(),
        occasionId: occasionId || idea.occasionId || null,
        sourceIdeaId: ideaId,
      },
    }),
    prisma.giftIdea.update({ where: { id: ideaId }, data: { status: 'GIVEN' } }),
  ])

  return NextResponse.json(givenGift, { status: 201 })
}
