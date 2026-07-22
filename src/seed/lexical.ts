
type LexicalText = {
  type: 'text'
  text: string
  detail: number
  format: number
  mode: 'normal'
  style: ''
  version: 1
}

function text(t: string): LexicalText {
  return { type: 'text', text: t, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }
}

export function lexical(blocks: Array<{ h2?: string; p?: string }>) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1 as const,
      direction: 'ltr' as const,
      children: blocks.map((b) =>
        b.h2 !== undefined
          ? {
              type: 'heading',
              tag: 'h2',
              format: '' as const,
              indent: 0,
              version: 1 as const,
              direction: 'ltr' as const,
              children: [text(b.h2)],
            }
          : {
              type: 'paragraph',
              format: '' as const,
              indent: 0,
              version: 1 as const,
              direction: 'ltr' as const,
              textFormat: 0,
              textStyle: '',
              children: [text(b.p ?? '')],
            },
      ),
    },
  }
}
