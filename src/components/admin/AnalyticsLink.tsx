export function AnalyticsLink() {
  // Set in Vercel project env — survives transferring the project to
  // another account (just update the variable, no code change).
  const url = process.env.ANALYTICS_URL
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="nav__link"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" />
      </svg>
      Analytics
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        style={{ opacity: 0.6 }}
      >
        <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
