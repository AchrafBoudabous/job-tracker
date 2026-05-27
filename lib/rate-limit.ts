type Entry = { count: number; resetAt: number }

const MAX_STORE_SIZE = 1_000

const store = new Map<string, Entry>()

function evictExpired(now: number) {
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
    if (store.size < MAX_STORE_SIZE) break
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    if (store.size >= MAX_STORE_SIZE) evictExpired(now)
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}