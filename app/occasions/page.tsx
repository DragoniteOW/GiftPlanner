'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Occasion { id: string; name: string; isBuiltIn: boolean }

export default function OccasionsPage() {
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const data = await fetch('/api/occasions').then((r) => r.json())
    setOccasions(data)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    const res = await fetch('/api/occasions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    })
    if (res.ok) {
      setNewName('')
      load()
    } else {
      toast.error('Failed to create occasion')
    }
    setSaving(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    const res = await fetch('/api/occasions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      load()
    } else {
      const data = await res.json()
      toast.error(data.error ?? 'Failed to delete')
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Occasions</h1>

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          placeholder="e.g. Valentine's Day"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="submit" disabled={saving}>Add</Button>
      </form>

      <div className="divide-y border rounded-lg">
        {occasions.map((o) => (
          <div key={o.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span>{o.name}</span>
              {o.isBuiltIn && <Badge variant="secondary">built-in</Badge>}
            </div>
            {!o.isBuiltIn && (
              <Button variant="ghost" size="sm" onClick={() => handleDelete(o.id, o.name)}>
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
