import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Ctx = { params: Promise<{ id: string; ideaId: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { ideaId } = await params
  const idea = await prisma.giftIdea.findUnique({
    where: { id: ideaId },
    include: { occasion: true, links: true },
  })
  if (!idea) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(idea)
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { ideaId } = await params
  const { title, occasionId, notes, todoNotes, imageUrl, status, links } = await req.json()

  await prisma.giftLink.deleteMany({ where: { giftIdeaId: ideaId } })

  const idea = await prisma.giftIdea.update({
    where: { id: ideaId },
    data: {
      title: title?.trim(),
      occasionId: occasionId || null,
      notes: notes?.trim() || null,
      todoNotes: todoNotes?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      status: status || undefined,
      links: links?.length
        ? { create: links.map((l: { url: string; label?: string }) => ({ url: l.url, label: l.label || null })) }
        : undefined,
    },
    include: { links: true, occasion: true },
  })
  return NextResponse.json(idea)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { ideaId } = await params
  await prisma.giftIdea.delete({ where: { id: ideaId } })
  return NextResponse.json({ ok: true })
}
