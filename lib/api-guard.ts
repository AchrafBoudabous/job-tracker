export function isAuthorized(request: Request): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  if (origin && host && origin.includes(host)) return true

  const secret = process.env.API_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth === `Bearer ${secret}`) return true
  }

  return false
}