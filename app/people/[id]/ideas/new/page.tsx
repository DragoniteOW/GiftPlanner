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

export default function NewIdeaPage() {
  const router = useRouter()
  const { id: personId } = useParams<{ id: string }>()
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [saving, setSaving] = useState(false)
  const [links, setLinks] = useState([{ url: '', label: '' }])
  const [form, setForm] = useState({ title: '', occasionId: '', notes: '', todoNotes: '', imageUrl: '' })

  useEffect(() => {
    fetch('/api/occasions').then((r) => r.json()).then(setOccasions)
  }, [])

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const validLinks = links.filter((l) => l.url.trim())
    const res = await fetch(`/api/people/${personId}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, occasionId: form.occasionId || null, links: validLinks }),
    })
    if (res.ok) {
      router.push(`/people/${personId}`)
    } else {
      toast.error('Idee konnte nicht gespeichert werden')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Geschenkidee hinzufügen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="title">Titel *</Label>
          <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="z. B. Blaue Laufschuhe" />
        </div>

        <div className="space-y-1">
          <Label>Anlass</Label>
          <Select value={form.occasionId} onValueChange={(v) => set('occasionId', v ?? '')}>
            <SelectTrigger><SelectValue>{form.occasionId ? (occasions.find(o => o.id === form.occasionId)?.name ?? 'Beliebiger Anlass') : 'Beliebiger Anlass'}</SelectValue></SelectTrigger>
            <SelectContent>
              {occasions.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notizen</Label>
          <Textarea id="notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Details, Größe, Farbe…" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="todoNotes">Aufgaben</Label>
          <Input id="todoNotes" value={form.todoNotes} onChange={(e) => set('todoNotes', e.target.value)} placeholder="Preis noch prüfen…" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Bild-URL</Label>
          <Input id="imageUrl" type="url" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://example.com/bild.jpg" />
        </div>

        <div className="space-y-2">
          <Label>Links</Label>
          {links.map((l, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="https://…" value={l.url} onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} />
              <Input placeholder="Bezeichnung" className="w-32" value={l.label} onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={() => setLinks([...links, { url: '', label: '' }])}>
            + Link hinzufügen
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Wird gespeichert…' : 'Idee hinzufügen'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Abbrechen</Button>
        </div>
      </form>
    </div>
  )
}
