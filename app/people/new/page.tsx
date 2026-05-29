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
      toast.error('Person konnte nicht erstellt werden')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Person hinzufügen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required placeholder="z. B. Alice" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="birthday">Geburtstag</Label>
          <Input id="birthday" name="birthday" type="date" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notizen / Interessen</Label>
          <Textarea id="notes" name="notes" placeholder="Kocht gerne, liest Science-Fiction…" />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Wird gespeichert…' : 'Person erstellen'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Abbrechen
          </Button>
        </div>
      </form>
    </div>
  )
}
