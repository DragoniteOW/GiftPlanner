'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const STATUSES = ['IDEA', 'ORDERED', 'BOUGHT', 'GIVEN'] as const

const STATUS_LABELS: Record<string, string> = {
  IDEA:    'Idee',
  ORDERED: 'Bestellt',
  BOUGHT:  'Gekauft',
  GIVEN:   'Überreicht',
}

export function IdeaStatusSelect({ personId, ideaId, status: initialStatus }: { personId: string; ideaId: string; status: string }) {
  const [status, setStatus] = useState(initialStatus)

  async function handleChange(val: string | null) {
    if (!val) return
    const res = await fetch(`/api/people/${personId}/ideas/${ideaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: val }),
    })
    if (res.ok) {
      setStatus(val)
    } else {
      toast.error('Status konnte nicht aktualisiert werden')
    }
  }

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger className="w-28 h-7 text-xs">
        <SelectValue>{STATUS_LABELS[status] ?? status}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
