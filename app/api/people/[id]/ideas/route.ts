import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: personId } = await params
  const ideas = await prisma.giftIdea.findMany({
    where: { personId },
    include: { occasion: true, links: true, givenGift: { select: { id: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(ideas)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: personId } = await params
  const { title, occasionId, notes, todoNotes, imageUrl, links } = await req.json()
  if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const idea = await prisma.giftIdea.create({
    data: {
      personId,
      title: title.trim(),
      occasionId: occasionId || null,
      notes: notes?.trim() || null,
      todoNotes: todoNotes?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      links: links?.length
        ? { create: links.map((l: { url: string; label?: string }) => ({ url: l.url, label: l.label || null })) }
        : undefined,
    },
    include: { links: true, occasion: true },
  })
  return NextResponse.json(idea, { status: 201 })
}
