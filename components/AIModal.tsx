'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  personId: string
  onSaveIdea?: (title: string) => void
}

export function AIModal({ personId, onSaveIdea }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string>('')

  async function fetchSuggestions() {
    setLoading(true)
    setSuggestions('')
    setOpen(true)
    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId }),
      })
      const data = await res.json()
      setSuggestions(data.suggestions ?? 'Keine Vorschläge erhalten.')
    } catch {
      setSuggestions('Fehler beim Laden der Vorschläge.')
    } finally {
      setLoading(false)
    }
  }

  const lines = suggestions.split('\n').filter((l) => l.trim())

  return (
    <>
      <Button variant="outline" onClick={fetchSuggestions}>
        KI-Vorschläge
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>KI-Geschenkvorschläge</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p className="text-sm text-muted-foreground">Einen Moment…</p>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                {lines.map((line, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <span className="text-sm">{line}</span>
                    {onSaveIdea && (
                      <button
                        onClick={() => {
                          const clean = line.replace(/^\d+\.\s*/, '')
                          onSaveIdea(clean)
                          setOpen(false)
                        }}
                        className="text-xs text-blue-600 hover:underline shrink-0"
                      >
                        Speichern
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {lines.length > 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    const params = new URLSearchParams({
                      title: 'KI-Vorschlag',
                      notes: lines.join('\n'),
                    })
                    setOpen(false)
                    router.push(`/people/${personId}/ideas/new?${params.toString()}`)
                  }}
                >
                  Als Idee erstellen
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
