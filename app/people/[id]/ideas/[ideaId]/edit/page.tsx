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
      toast.error('Failed to save')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this idea?')) return
    await fetch(`/api/people/${personId}/ideas/${ideaId}`, { method: 'DELETE' })
    router.push(`/people/${personId}`)
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Idea</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => v && set('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['IDEA', 'ORDERED', 'BOUGHT', 'GIVEN'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Occasion</Label>
          <Select value={form.occasionId} onValueChange={(v) => set('occasionId', v ?? '')}>
            <SelectTrigger><SelectValue placeholder="Any occasion" /></SelectTrigger>
            <SelectContent>
              {occasions.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Notes</Label>
          <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>To-do notes</Label>
          <Input value={form.todoNotes} onChange={(e) => set('todoNotes', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Image URL</Label>
          <Input type="url" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Links</Label>
          {links.map((l, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="https://…" value={l.url} onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} />
              <Input placeholder="Label" className="w-32" value={l.label} onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={() => setLinks([...links, { url: '', label: '' }])}>
            + Add link
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="button" variant="destructive" className="ml-auto" onClick={handleDelete}>Delete</Button>
        </div>
      </form>
    </div>
  )
}
