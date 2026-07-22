import { readFileSync } from 'fs'
import { execSync } from 'child_process'

export function docxText(path: string): string {
  const xml = execSync(`unzip -p "${path.replace(/"/g, '\\"')}" word/document.xml`, {
    maxBuffer: 32 * 1024 * 1024,
  }).toString('utf8')
  return xml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

export function readFile(path: string): Buffer {
  return readFileSync(path)
}

type Run = { text: string; bold?: boolean }

function textNode(r: Run) {
  return {
    type: 'text',
    text: r.text,
    detail: 0,
    format: r.bold ? 1 : 0,
    mode: 'normal',
    style: '',
    version: 1,
  }
}

export function lexicalFromParagraphs(paragraphs: Array<{ h2?: string; runs?: Run[] }>) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1 as const,
      direction: 'ltr' as const,
      children: paragraphs.map((b) =>
        b.h2 !== undefined
          ? {
              type: 'heading',
              tag: 'h2',
              format: '' as const,
              indent: 0,
              version: 1 as const,
              direction: 'ltr' as const,
              children: [textNode({ text: b.h2 })],
            }
          : {
              type: 'paragraph',
              format: '' as const,
              indent: 0,
              version: 1 as const,
              direction: 'ltr' as const,
              textFormat: 0,
              textStyle: '',
              children: (b.runs ?? []).map(textNode),
            },
      ),
    },
  }
}

/** Generic docx → structured paragraphs: bolds "Speaker Name:" prefixes. */
export function parseBody(text: string, skipLines = 0): Array<{ h2?: string; runs?: Run[] }> {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(skipLines)

  return lines.map((line) => {
    const m = line.match(/^(.{2,80}?):\s+(.+)$/s)
    if (m && !/^https?$/.test(m[1])) {
      return { runs: [{ text: `${m[1]}: `, bold: true }, { text: m[2] }] }
    }
    return { runs: [{ text: line }] }
  })
}

export type RichRun = { text: string; format: number }
export type DocBlock = { kind: 'heading' | 'quote' | 'paragraph'; runs: RichRun[] }

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, '&')
}

type RawPara = { runs: RichRun[]; center: boolean; maxSize: number; allBold: boolean }

function extractParagraphs(path: string): RawPara[] {
  const xml = execSync(`unzip -p "${path.replace(/"/g, '\\"')}" word/document.xml`, {
    maxBuffer: 64 * 1024 * 1024,
  }).toString('utf8')

  const paras: RawPara[] = []
  for (const p of xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) ?? []) {
    const center = /<w:jc w:val="center"/.test(p)
    let maxSize = 0
    let runs: RichRun[] = []
    const runXml = p.replace(/<w:(?:tab|br)\s*\/>/g, '<w:t xml:space="preserve"> </w:t>')
    for (const r of runXml.match(/<w:r[ >][\s\S]*?<\/w:r>/g) ?? []) {
      const rpr = r.match(/<w:rPr>[\s\S]*?<\/w:rPr>/)?.[0] ?? ''
      const bold = /<w:b\b(?![^>]*w:val="(?:false|0)")/.test(rpr)
      const italic = /<w:i\b(?![^>]*w:val="(?:false|0)")/.test(rpr)
      const sz = rpr.match(/<w:sz w:val="(\d+)"/)
      if (sz) maxSize = Math.max(maxSize, Number(sz[1]))
      const text = (r.match(/<w:t[^>]*>[\s\S]*?<\/w:t>/g) ?? [])
        .map((t) => decodeEntities(t.replace(/<w:t[^>]*>|<\/w:t>/g, '')))
        .join('')
      if (text) runs.push({ text: text.replace(/\s+/g, ' '), format: (bold ? 1 : 0) | (italic ? 2 : 0) })
    }

    const merged: RichRun[] = []
    for (const run of runs) {
      const last = merged[merged.length - 1]
      if (last && last.format === run.format) last.text += run.text
      else merged.push({ ...run })
    }
    runs = merged
    if (runs.length > 0) {
      runs[0].text = runs[0].text.replace(/^\s+/, '')
      runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/\s+$/, '')
      runs = runs.filter((r) => r.text !== '')
    }
    if (runs.length === 0) continue

    paras.push({
      runs,
      center,
      maxSize,
      allBold: runs.every((r) => (r.format & 1) === 1),
    })
  }
  return paras
}

/**
 * Rich docx parser for the magazine article files. The source documents carry
 * no named styles, so structure is recovered from run formatting: headings are
 * fully-bold lines that are centered or larger than the body size, and spoken
 * quotes open with a quotation mark.
 */
export function parseDocxRich(path: string): DocBlock[] {
  const paras = extractParagraphs(path)

  const sizeCounts = new Map<number, number>()
  for (const p of paras) sizeCounts.set(p.maxSize, (sizeCounts.get(p.maxSize) ?? 0) + 1)
  const bodySize = [...sizeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0

  const blocks: DocBlock[] = []
  for (const p of paras) {
    const plain = p.runs.map((r) => r.text).join('').trim()
    if (plain === '' || /^\*{3,}$/.test(plain)) continue
    if (/^\|?\s*homeland of wine( magazine)?\s*\|?$/i.test(plain)) continue

    const isHeading =
      p.allBold && plain.length < 90 && (p.center || p.maxSize > bodySize)
    if (isHeading) {
      blocks.push({ kind: 'heading', runs: p.runs.map((r) => ({ ...r, format: r.format & 2 })) })
      continue
    }
    if (/^[“"„«]/.test(plain)) {
      blocks.push({ kind: 'quote', runs: p.runs })
      continue
    }

    let runs = p.runs
    if (runs[0].format === 0) {
      const m = runs[0].text.match(/^(.{2,80}?):\s+([\s\S]+)$/)
      if (m && !/https?$/i.test(m[1])) {
        runs = [{ text: `${m[1]}: `, format: 1 }, { text: m[2], format: 0 }, ...runs.slice(1)]
      }
    }
    blocks.push({ kind: 'paragraph', runs })
  }

  let start = 0
  while (start < blocks.length && blocks[start].kind === 'heading') start++
  return blocks.slice(start)
}

function richTextNode(r: RichRun) {
  return {
    type: 'text',
    text: r.text,
    detail: 0,
    format: r.format,
    mode: 'normal',
    style: '',
    version: 1,
  }
}

export function lexicalFromDocBlocks(blocks: DocBlock[]) {
  const base = { format: '' as const, indent: 0, version: 1 as const, direction: 'ltr' as const }
  return {
    root: {
      type: 'root',
      ...base,
      children: blocks.map((b) => {
        const children = b.runs.map(richTextNode)
        if (b.kind === 'heading') return { type: 'heading', tag: 'h2', ...base, children }
        if (b.kind === 'quote') return { type: 'quote', ...base, children }
        return { type: 'paragraph', ...base, textFormat: 0, textStyle: '', children }
      }),
    },
  }
}
