export function safeHref(url: string | null | undefined): string {
  if (!url) return '#'
  try {
    const { protocol } = new URL(url)
    return protocol === 'http:' || protocol === 'https:' ? url : '#'
  } catch {
    return '#'
  }
}