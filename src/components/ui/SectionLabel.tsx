export function SectionLabel({
  children,
  dark = false,
  accent = false,
}: {
  children: React.ReactNode
  dark?: boolean
  accent?: boolean
}) {
  return (
    <span
      className={`caps inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium ${
        accent ? 'bg-accent text-shell-fg' : dark ? 'bg-shell-soft text-shell-fg' : 'bg-stone text-ink'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${accent ? 'bg-shell-fg' : 'bg-accent'}`}
      />
      {children}
    </span>
  )
}
