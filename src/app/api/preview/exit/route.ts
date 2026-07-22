import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  const draft = await draftMode()
  draft.disable()
  const url = new URL(req.url)
  redirect(url.searchParams.get('redirect') ?? '/')
}
