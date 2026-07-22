import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function ArticleBody({ data }: { data: SerializedEditorState }) {
  return (
    <div className="article-body">
      <RichText data={data} disableContainer />
    </div>
  )
}
