export function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium ${
        dark ? 'bg-shell-soft text-shell-fg' : 'bg-stone text-ink'
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  )
}
