import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const occasions = await prisma.occasion.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(occasions)
}

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const occasion = await prisma.occasion.create({ data: { name: name.trim() } })
  return NextResponse.json(occasion, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const occasion = await prisma.occasion.findUnique({ where: { id } })
  if (!occasion) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (occasion.isBuiltIn) return NextResponse.json({ error: 'Cannot delete built-in occasion' }, { status: 403 })
  await prisma.occasion.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
