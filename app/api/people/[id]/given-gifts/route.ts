import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: personId } = await params
  const gifts = await prisma.givenGift.findMany({
    where: { personId },
    include: { occasion: true },
    orderBy: { givenDate: 'desc' },
  })
  return NextResponse.json(gifts)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: personId } = await params
  const { title, notes, imageUrl, givenDate, occasionId } = await req.json()
  if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const gift = await prisma.givenGift.create({
    data: {
      personId,
      title: title.trim(),
      notes: notes?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      givenDate: givenDate ? new Date(givenDate) : new Date(),
      occasionId: occasionId || null,
    },
    include: { occasion: true },
  })
  return NextResponse.json(gift, { status: 201 })
}
