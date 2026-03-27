/**
 * Format a view/subscriber count into a human-readable string.
 * 1B+ → "1.2B" | 1M+ → "127M" | 1K+ → "84K" | else → raw string
 */
export function formatViews(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

/**
 * Format seconds into MM:SS (or H:MM:SS for videos over an hour).
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${h}:${mm}:${ss}`
  return `${m}:${ss}`
}

/**
 * Return a human-readable relative time string from an ISO date.
 * e.g. "3 days ago", "2 weeks ago", "4 months ago"
 */
export function relativeTime(isoDate: string): string {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const diff = now - then

  const minutes = Math.floor(diff / 60_000)
  const hours   = Math.floor(diff / 3_600_000)
  const days    = Math.floor(diff / 86_400_000)
  const weeks   = Math.floor(days / 7)
  const months  = Math.floor(days / 30)
  const years   = Math.floor(days / 365)

  if (years >= 1)   return `${years} ${years === 1 ? 'year' : 'years'} ago`
  if (months >= 1)  return `${months} ${months === 1 ? 'month' : 'months'} ago`
  if (weeks >= 1)   return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  if (days >= 1)    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  if (hours >= 1)   return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  if (minutes >= 1) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  return 'just now'
}

/** Alias — same behaviour as formatViews */
export function formatSubscribers(n: number): string {
  return formatViews(n)
}

/**
 * Parse the first character of an intelligence brief bullet to determine sentiment.
 * ↑ → "up" | ↓ → "down" | ⚠ → "warning" | anything else → "neutral"
 */
export function getSentimentIcon(
  bullet: string
): 'up' | 'down' | 'warning' | 'neutral' {
  const first = bullet.trimStart().charAt(0)
  if (first === '↑') return 'up'
  if (first === '↓') return 'down'
  if (first === '⚠') return 'warning'
  return 'neutral'
}
