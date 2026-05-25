import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const person = await prisma.person.findUnique({ where: { id } })
  if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(person)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name, birthday, notes, regenerateToken } = await req.json()

  const data: Record<string, unknown> = {}
  if (name !== undefined) data.name = name.trim()
  if (birthday !== undefined) data.birthday = birthday ? new Date(birthday) : null
  if (notes !== undefined) data.notes = notes?.trim() || null
  if (regenerateToken) data.shareToken = crypto.randomUUID()

  const person = await prisma.person.update({ where: { id }, data })
  return NextResponse.json(person)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.person.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
