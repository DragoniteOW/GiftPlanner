'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function EditPersonPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', birthday: '', notes: '' })

  useEffect(() => {
    fetch(`/api/people/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          name: p.name,
          birthday: p.birthday ? new Date(p.birthday).toISOString().slice(0, 10) : '',
          notes: p.notes ?? '',
        })
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/people/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, birthday: form.birthday || null, notes: form.notes }),
    })
    if (res.ok) {
      router.push(`/people/${id}`)
    } else {
      toast.error('Failed to save')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${form.name}? This cannot be undone.`)) return
    await fetch(`/api/people/${id}`, { method: 'DELETE' })
    router.push('/people')
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Person</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="birthday">Birthday</Label>
          <Input id="birthday" type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes / interests</Label>
          <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="button" variant="destructive" className="ml-auto" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </form>
    </div>
  )
}
