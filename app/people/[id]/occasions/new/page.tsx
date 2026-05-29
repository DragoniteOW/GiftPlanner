'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Occasion { id: string; name: string }

export default function NewOccasionPage() {
  const router = useRouter()
  const { id: personId } = useParams<{ id: string }>()
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ occasionId: '', date: '', notes: '' })

  useEffect(() => {
    fetch('/api/occasions').then((r) => r.json()).then(setOccasions)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/people/${personId}/occasions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast.success('Anlass hinzugefügt!')
      router.push(`/people/${personId}`)
    } else {
      toast.error('Anlass konnte nicht hinzugefügt werden')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-sm space-y-6">
      <h1 className="text-2xl font-bold">Anlass hinzufügen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label>Anlass *</Label>
          <Select value={form.occasionId} onValueChange={(v) => setForm({ ...form, occasionId: v ?? '' })} required>
            <SelectTrigger><SelectValue>{form.occasionId ? (occasions.find(o => o.id === form.occasionId)?.name ?? 'Auswählen…') : 'Auswählen…'}</SelectValue></SelectTrigger>
            <SelectContent>
              {occasions.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Datum *</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </div>
        <div className="space-y-1">
          <Label>Notizen</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Wird gespeichert…' : 'Hinzufügen'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Abbrechen</Button>
        </div>
      </form>
    </div>
  )
}
