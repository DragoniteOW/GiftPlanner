import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string; eventId: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const { eventId } = await params
  const { occasionId, date, notes } = await req.json()
  if (!occasionId || !date) return NextResponse.json({ error: 'occasionId and date are required' }, { status: 400 })

  const event = await prisma.personEvent.update({
    where: { id: eventId },
    data: { occasionId, date: new Date(date), notes: notes?.trim() || null },
    include: { occasion: true },
  })
  return NextResponse.json(event)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { eventId } = await params
  await prisma.personEvent.delete({ where: { id: eventId } })
  return new NextResponse(null, { status: 204 })
}
