import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

function safeRevalidate(tags: string[]) {
  for (const tag of tags) {
    try {
      revalidateTag(tag, 'max')
    } catch {
    }
  }
}

export const revalidateArticles: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate(['articles', `article:${doc.id}`])
  return doc
}

export const revalidateArticlesDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidate(['articles', `article:${doc.id}`])
  return doc
}

export const revalidateCategories: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate(['categories', 'articles'])
  return doc
}

export const revalidateCategoriesDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidate(['categories', 'articles'])
  return doc
}

export function revalidateGlobal(tag: string): GlobalAfterChangeHook {
  return ({ doc }) => {
    safeRevalidate([tag])
    return doc
  }
}
