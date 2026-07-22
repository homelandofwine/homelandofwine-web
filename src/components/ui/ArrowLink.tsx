import { Link } from '@/i18n/navigation'

export function ArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 14 14 2M14 2H5M14 2v9" strokeLinecap="square" />
    </svg>
  )
}

export function ArrowLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent ${className}`}
    >
      <span>{children}</span>
      <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  )
}
