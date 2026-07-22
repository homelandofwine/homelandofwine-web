'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import type { Locale } from '@/i18n/routing'

type Alternates = Partial<Record<Locale, string>>

const AlternateLinksContext = createContext<{
  alternates: Alternates
  setAlternates: (a: Alternates) => void
}>({ alternates: {}, setAlternates: () => {} })

export function AlternateLinksProvider({ children }: { children: React.ReactNode }) {
  const [alternates, setAlternates] = useState<Alternates>({})
  return (
    <AlternateLinksContext.Provider value={{ alternates, setAlternates }}>
      {children}
    </AlternateLinksContext.Provider>
  )
}

export function SetAlternates({ alternates }: { alternates: Alternates }) {
  const { setAlternates } = useContext(AlternateLinksContext)
  useEffect(() => {
    setAlternates(alternates)
    return () => setAlternates({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(alternates)])
  return null
}

export function useAlternates() {
  return useContext(AlternateLinksContext).alternates
}
