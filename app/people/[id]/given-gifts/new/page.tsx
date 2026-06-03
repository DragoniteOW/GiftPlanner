'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface Occasion { id: string; name: string }

export default function NewGivenGiftPage() {
  const router = useRouter()
  const { id: personId } = useParams<{ id: string }>()
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    givenDate: new Date().toISOString().slice(0, 10),
    occasionId: '',
    notes: '',
    imageUrl: '',
  })

  useEffect(() => {
    fetch('/api/occasions').then((r) => r.json()).then(setOccasions)
  }, [])

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/people/${personId}/given-gifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, occasionId: form.occasionId || null }),
    })
    if (res.ok) {
      toast.success('Geschenk gespeichert')
      router.push(`/people/${personId}`)
    } else {
      toast.error('Speichern fehlgeschlagen')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-sm space-y-6">
      <h1 className="text-2xl font-bold">Geschenk erfassen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="title">Titel *</Label>
          <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="z. B. Blaue Laufschuhe" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="givenDate">Überreicht am *</Label>
          <Input id="givenDate" type="date" value={form.givenDate} onChange={(e) => set('givenDate', e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Anlass</Label>
          <Select value={form.occasionId} onValueChange={(v) => set('occasionId', v ?? '')}>
            <SelectTrigger>
              <SelectValue>{form.occasionId ? (occasions.find(o => o.id === form.occasionId)?.name ?? 'Beliebiger Anlass') : 'Beliebiger Anlass'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {occasions.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notizen</Label>
          <Textarea id="notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="imageUrl">Bild-URL</Label>
          <Input id="imageUrl" type="url" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://example.com/bild.jpg" />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Wird gespeichert…' : 'Speichern'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Abbrechen</Button>
        </div>
      </form>
    </div>
  )
}
