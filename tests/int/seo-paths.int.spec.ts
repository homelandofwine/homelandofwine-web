import { describe, expect, it } from 'vitest'

import { articlePath, categoryPath } from '@/lib/seo'
import { Categories } from '@/collections/Categories'

describe('articlePath', () => {
  it('builds /{category}/{slug} from a populated category', () => {
    expect(articlePath({ slug: 'saperavi', category: { slug: 'wines' } })).toBe('/wines/saperavi')
  })

  it('resolves an unpopulated category id through the map', () => {
    expect(articlePath({ slug: 'saperavi', category: 4 }, { '4': 'wines' })).toBe(
      '/wines/saperavi',
    )
  })

  it('falls back to /blog for an unpopulated id without a map', () => {
    expect(articlePath({ slug: 'saperavi', category: 42 })).toBe('/blog/saperavi')
  })

  it('falls back to /blog for a null category', () => {
    expect(articlePath({ slug: 'saperavi', category: null })).toBe('/blog/saperavi')
  })

  it('falls back to /blog for an id missing from the map', () => {
    expect(articlePath({ slug: 'saperavi', category: 99 }, { '4': 'wines' })).toBe(
      '/blog/saperavi',
    )
  })
})

describe('categoryPath', () => {
  it.each([
    ['wines', '/wines'],
    ['main-feature', '/main-feature'],
    ['ambassador', '/ambassador'],
    ['wine-ambassadors', '/ambassador'],
    ['n-line-print', '/n-line-print'],
  ])('maps %s to %s', (slug, path) => {
    expect(categoryPath(slug)).toBe(path)
  })

  it('special categories fail the identity guard so listing pages redirect them', () => {
    expect(categoryPath('wine-ambassadors')).not.toBe('/wine-ambassadors')
    expect(categoryPath('wines')).toBe('/wines')
  })
})

describe('Categories slug field', () => {
  const slugField = Categories.fields.find(
    (f) => 'name' in f && f.name === 'slug',
  ) as { localized?: boolean; validate?: (v: string | null | undefined) => true | string }

  it('rejects every reserved route slug', () => {
    for (const reserved of [
      'blog',
      'about',
      'contact',
      'search',
      'privacy',
      'unsubscribed',
      'ambassador',
      'n-line-print',
      'ka',
      'en',
      'api',
      'admin',
    ]) {
      expect(slugField.validate?.(reserved)).not.toBe(true)
    }
  })

  it('accepts a normal slug', () => {
    expect(slugField.validate?.('wine-regions')).toBe(true)
  })

  it('stays unlocalized so static params agree with canonical redirects', () => {
    expect(slugField.localized).toBeFalsy()
  })
})
