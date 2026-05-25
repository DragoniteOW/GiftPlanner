import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: personId } = await params
  const events = await prisma.personEvent.findMany({
    where: { personId },
    include: { occasion: true },
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: personId } = await params
  const { occasionId, date, notes } = await req.json()
  if (!occasionId || !date) return NextResponse.json({ error: 'occasionId and date are required' }, { status: 400 })

  const event = await prisma.personEvent.create({
    data: { personId, occasionId, date: new Date(date), notes: notes?.trim() || null },
    include: { occasion: true },
  })
  return NextResponse.json(event, { status: 201 })
}
