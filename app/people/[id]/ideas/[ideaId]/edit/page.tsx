'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface Occasion { id: string; name: string }

const STATUS_LABELS: Record<string, string> = {
  IDEA:    'Idee',
  ORDERED: 'Bestellt',
  BOUGHT:  'Gekauft',
}

export default function EditIdeaPage() {
  const router = useRouter()
  const { id: personId, ideaId } = useParams<{ id: string; ideaId: string }>()
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [saving, setSaving] = useState(false)
  const [links, setLinks] = useState([{ url: '', label: '' }])
  const [form, setForm] = useState({ title: '', occasionId: '', notes: '', todoNotes: '', imageUrl: '', status: 'IDEA' })

  useEffect(() => {
    Promise.all([
      fetch(`/api/people/${personId}/ideas/${ideaId}`).then((r) => r.json()),
      fetch('/api/occasions').then((r) => r.json()),
    ]).then(([idea, occ]) => {
      setOccasions(occ)
      setForm({
        title: idea.title,
        occasionId: idea.occasionId ?? '',
        notes: idea.notes ?? '',
        todoNotes: idea.todoNotes ?? '',
        imageUrl: idea.imageUrl ?? '',
        status: idea.status,
      })
      setLinks(idea.links?.length ? idea.links : [{ url: '', label: '' }])
    })
  }, [personId, ideaId])

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const validLinks = links.filter((l) => l.url.trim())
    const res = await fetch(`/api/people/${personId}/ideas/${ideaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, occasionId: form.occasionId || null, links: validLinks }),
    })
    if (res.ok) {
      router.push(`/people/${personId}`)
    } else {
      toast.error('Speichern fehlgeschlagen')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Diese Idee wirklich löschen?')) return
    await fetch(`/api/people/${personId}/ideas/${ideaId}`, { method: 'DELETE' })
    router.push(`/people/${personId}`)
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Idee bearbeiten</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label>Titel *</Label>
          <Input value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => v && set('status', v)}>
            <SelectTrigger><SelectValue>{STATUS_LABELS[form.status] ?? form.status}</SelectValue></SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Label>Notizen</Label>
          <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Aufgaben</Label>
          <Input value={form.todoNotes} onChange={(e) => set('todoNotes', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Bild-URL</Label>
          <Input type="url" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
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
        <div className="flex gap-2 flex-wrap">
          <Button type="submit" disabled={saving}>{saving ? 'Wird gespeichert…' : 'Speichern'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Abbrechen</Button>
          {form.status !== 'GIVEN' && (
            <Link href={`/people/${personId}/ideas/${ideaId}/promote`} className={buttonVariants({ variant: 'secondary' })}>Als überreicht markieren</Link>
          )}
          <Button type="button" variant="destructive" className="ml-auto" onClick={handleDelete}>Löschen</Button>
        </div>
      </form>
    </div>
  )
}
