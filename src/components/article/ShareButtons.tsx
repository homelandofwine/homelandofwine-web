const ICON_CLASS = 'h-[18px] w-[18px]'

function links(url: string, title: string) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  return [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS}>
          <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21Z" />
        </svg>
      ),
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS}>
          <path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.2L5.6 21h-3l7.1-8.1L2 3h6.3l4.3 5.7Zm-1.1 16.2h1.7L7.4 4.7H5.6Z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${t}%20${u}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS}>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.2.2-.3.3-.5a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.1 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.4 3.9 14.6 14.6 0 0 0 1.5.5 3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3Z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS}>
          <path d="M6.9 21H3.3V8.9h3.6ZM5.1 7.3a2.1 2.1 0 1 1 2.1-2.1 2.1 2.1 0 0 1-2.1 2.1ZM21 21h-3.6v-5.9c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1V21H9.6V8.9h3.4v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.7 0 4.4 2.4 4.4 5.5Z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      href: `mailto:?subject=${t}&body=${u}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={ICON_CLASS}
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]
}

export function ShareButtons({ url, title }: { url: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      {links(url, title).map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.name}`}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:bg-accent hover:text-shell-fg"
        >
          {l.icon}
        </a>
      ))}
    </div>
  )
}
