const map: Record<string, { label: string; className: string }> = {
  IDEA: { label: 'Idea', className: 'bg-gray-100 text-gray-700' },
  ORDERED: { label: 'Ordered', className: 'bg-blue-100 text-blue-700' },
  BOUGHT: { label: 'Bought', className: 'bg-green-100 text-green-700' },
  GIVEN: { label: 'Given', className: 'bg-purple-100 text-purple-700' },
}

export function StatusBadge({ status }: { status: string }) {
  const entry = map[status] ?? map.IDEA
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entry.className}`}>
      {entry.label}
    </span>
  )
}
