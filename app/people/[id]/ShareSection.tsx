'use client'

import { useState } from 'react'
import { Share2Icon, CopyIcon, RefreshCwIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Props {
  personId: string
  shareToken: string
}

export function ShareSection({ personId, shareToken: initialToken }: Props) {
  const [token, setToken] = useState(initialToken)
  const [copying, setCopying] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/share/${token}`
    : `/share/${token}`

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopying(true)
    toast.success('Link kopiert!')
    setTimeout(() => setCopying(false), 1500)
  }

  async function regenerate() {
    if (!confirm('Der aktuelle Share-Link wird ungültig. Fortfahren?')) return
    setRegenerating(true)
    const res = await fetch(`/api/people/${personId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regenerateToken: true }),
    })
    if (res.ok) {
      const updated = await res.json()
      setToken(updated.shareToken)
      toast.success('Link wurde neu generiert')
    }
    setRegenerating(false)
  }

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        <Share2Icon className="size-4" />
        Teilen
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Geschenkideen teilen</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Jeder mit diesem Link kann die Geschenkideen dieser Person ansehen – kein Login erforderlich.
        </p>

        <div className="flex gap-2">
          <Input readOnly value={shareUrl} className="text-xs" onClick={(e) => (e.target as HTMLInputElement).select()} />
          <Button variant="outline" size="sm" onClick={copyLink} disabled={copying} className="shrink-0">
            <CopyIcon className="size-4" />
            {copying ? 'Kopiert!' : 'Kopieren'}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={regenerate} disabled={regenerating} className="text-muted-foreground">
            <RefreshCwIcon className="size-4" />
            {regenerating ? 'Wird neu generiert…' : 'Link neu generieren'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
