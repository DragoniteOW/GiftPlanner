import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/Nav'
import { NotificationModal } from '@/components/NotificationModal'
import { Toaster } from '@/components/ui/sonner'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Gift Planner',
  description: 'Organise gift ideas for the people you care about',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Nav />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <NotificationModal />
        <Toaster />
      </body>
    </html>
  )
}
