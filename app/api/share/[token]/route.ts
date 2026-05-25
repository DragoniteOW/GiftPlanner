import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
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
  if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(person)
}
