'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Notification } from '@/lib/notifications'

export function NotificationModal() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const key = `notif-checked-${new Date().toISOString().slice(0, 10)}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data: Notification[]) => {
        if (data.length > 0) {
          setNotifications(data)
          setOpen(true)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upcoming occasions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {notifications.map((n, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Link href={`/people/${n.personId}`} onClick={() => setOpen(false)} className="font-semibold hover:underline">
                  {n.personName}
                </Link>
                <Badge variant="secondary">{n.occasionName}</Badge>
                <span className="text-sm text-muted-foreground ml-auto">
                  {n.daysUntil === 0 ? 'Today!' : `in ${n.daysUntil} day${n.daysUntil === 1 ? '' : 's'}`}
                </span>
              </div>
              {n.giftIdeas.length > 0 ? (
                <ul className="text-sm text-muted-foreground pl-2 space-y-0.5">
                  {n.giftIdeas.map((g) => (
                    <li key={g.id} className="flex items-center gap-1">
                      <span>{g.title}</span>
                      <StatusBadge status={g.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground pl-2">No gift ideas yet.</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    IDEA: 'bg-gray-100 text-gray-700',
    ORDERED: 'bg-blue-100 text-blue-700',
    BOUGHT: 'bg-green-100 text-green-700',
    GIVEN: 'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${map[status] ?? map.IDEA}`}>
      {status}
    </span>
  )
}
