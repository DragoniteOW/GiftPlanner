import { NextRequest, NextResponse } from 'next/server'
import { suggestGifts } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  const { personId } = await req.json()
  if (!personId) return NextResponse.json({ error: 'personId is required' }, { status: 400 })
  const suggestions = await suggestGifts(personId)
  return NextResponse.json({ suggestions })
}
