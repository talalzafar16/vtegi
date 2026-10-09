import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'

type RichTextProps = {
  data: SerializedEditorState | null | undefined
  className?: string
}

/** Renders CMS rich text with the site's typography (see `.rich-text` in globals.css). */
export function RichText({ data, className }: RichTextProps) {
  if (!data) return null
  return <LexicalRichText data={data} className={cn('rich-text', className)} />
}
