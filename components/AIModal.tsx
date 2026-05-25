'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  personId: string
  onSaveIdea?: (title: string) => void
}

export function AIModal({ personId, onSaveIdea }: Props) {
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
      setSuggestions(data.suggestions ?? 'No suggestions returned.')
    } catch {
      setSuggestions('Failed to fetch suggestions.')
    } finally {
      setLoading(false)
    }
  }

  const lines = suggestions.split('\n').filter((l) => l.trim())

  return (
    <>
      <Button variant="outline" onClick={fetchSuggestions}>
        AI Suggestions
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI Gift Suggestions</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p className="text-sm text-muted-foreground">Thinking…</p>
          ) : (
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
                      Save
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
