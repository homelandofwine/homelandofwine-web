export function DraftBanner({ exitPath }: { exitPath: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex items-center justify-center gap-4 bg-accent px-4 py-3 text-sm font-semibold text-shell-fg">
      Draft preview — this version is not public.
      <a
        href={`/api/preview/exit?redirect=${encodeURIComponent(exitPath)}`}
        className="rounded bg-page px-3 py-1 text-ink transition-colors hover:bg-stone"
      >
        Exit preview
      </a>
    </div>
  )
}
