'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface Occasion { id: string; name: string }

export default function PromoteIdeaPage() {
  const router = useRouter()
  const { id: personId, ideaId } = useParams<{ id: string; ideaId: string }>()
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ givenDate: new Date().toISOString().slice(0, 10), occasionId: '' })

  useEffect(() => {
    fetch('/api/occasions').then((r) => r.json()).then(setOccasions)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/people/${personId}/ideas/${ideaId}/promote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ givenDate: form.givenDate, occasionId: form.occasionId || null }),
    })
    if (res.ok) {
      toast.success('Als überreicht markiert!')
      router.push(`/people/${personId}`)
    } else {
      toast.error('Fehler beim Markieren')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-sm space-y-6">
      <h1 className="text-2xl font-bold">Geschenk als überreicht markieren</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="givenDate">Überreicht am *</Label>
          <Input id="givenDate" type="date" value={form.givenDate} onChange={(e) => setForm({ ...form, givenDate: e.target.value })} required />
        </div>
        <div className="space-y-1">
          <Label>Anlass</Label>
          <Select value={form.occasionId} onValueChange={(v) => setForm({ ...form, occasionId: v ?? '' })}>
            <SelectTrigger><SelectValue>{form.occasionId ? (occasions.find(o => o.id === form.occasionId)?.name ?? 'Anlass auswählen') : 'Anlass auswählen'}</SelectValue></SelectTrigger>
            <SelectContent>
              {occasions.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Wird gespeichert…' : 'Bestätigen'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Abbrechen</Button>
        </div>
      </form>
    </div>
  )
}
