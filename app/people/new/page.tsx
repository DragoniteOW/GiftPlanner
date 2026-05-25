'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function NewPersonPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        birthday: form.get('birthday') || null,
        notes: form.get('notes') || null,
      }),
    })
    if (res.ok) {
      const person = await res.json()
      router.push(`/people/${person.id}`)
    } else {
      toast.error('Failed to create person')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Add Person</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required placeholder="e.g. Alice" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="birthday">Birthday</Label>
          <Input id="birthday" name="birthday" type="date" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes / interests</Label>
          <Textarea id="notes" name="notes" placeholder="Likes cooking, reads sci-fi…" />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Create Person'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
