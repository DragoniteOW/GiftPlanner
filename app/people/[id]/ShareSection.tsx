'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props {
  personId: string
  shareToken: string
}

export function ShareSection({ personId, shareToken: initialToken }: Props) {
  const [token, setToken] = useState(initialToken)
  const [copying, setCopying] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${token}` : `/share/${token}`

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopying(true)
    toast.success('Link copied!')
    setTimeout(() => setCopying(false), 1500)
  }

  async function regenerate() {
    const res = await fetch(`/api/people/${personId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regenerateToken: true }),
    })
    if (res.ok) {
      const updated = await res.json()
      setToken(updated.shareToken)
      toast.success('Share link regenerated')
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
      <span>Share link:</span>
      <code className="bg-muted px-2 py-0.5 rounded text-xs truncate max-w-xs">/share/{token.slice(0, 8)}…</code>
      <Button variant="ghost" size="sm" onClick={copyLink} disabled={copying}>
        {copying ? 'Copied!' : 'Copy'}
      </Button>
      <Button variant="ghost" size="sm" onClick={regenerate}>
        Regenerate
      </Button>
    </div>
  )
}
