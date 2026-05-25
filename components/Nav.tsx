import Link from 'next/link'

export function Nav() {
  return (
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-bold text-lg">
          🎁 Gift Planner
        </Link>
        <Link href="/people" className="text-sm text-muted-foreground hover:text-foreground">
          People
        </Link>
        <Link href="/occasions" className="text-sm text-muted-foreground hover:text-foreground">
          Occasions
        </Link>
        <Link href="/print" className="text-sm text-muted-foreground hover:text-foreground ml-auto print:hidden">
          Print List
        </Link>
      </div>
    </nav>
  )
}
