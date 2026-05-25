import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const people = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { giftIdeas: true, givenGifts: true } } },
  })
  return NextResponse.json(people)
}

export async function POST(req: NextRequest) {
  const { name, birthday, notes } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const person = await prisma.person.create({
    data: {
      name: name.trim(),
      birthday: birthday ? new Date(birthday) : null,
      notes: notes?.trim() || null,
    },
  })
  return NextResponse.json(person, { status: 201 })
}
