import type { Channel } from '@/src/types'

const BASE = 'https://www.googleapis.com/youtube/v3'

// ── Exported URL extraction helpers ────────────────────────────────────

export function extractVideoId(url: string): string | null {
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]
  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return shortsMatch[1]
  const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]
  const liveMatch = url.match(/\/live\/([a-zA-Z0-9_-]{11})/)
  if (liveMatch) return liveMatch[1]
  return null
}

export function extractChannelHandle(url: string): string | null {
  const handleMatch = url.match(/\/@([a-zA-Z0-9_.-]+)/)
  if (handleMatch) return handleMatch[1]
  if (url.startsWith('@')) return url.slice(1).trim()
  return null
}

export function extractChannelId(url: string): string | null {
  const match = url.match(/\/channel\/(UC[a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

export function extractCustomUrl(url: string): string | null {
  const cMatch = url.match(/\/c\/([a-zA-Z0-9_.-]+)/)
  if (cMatch) return cMatch[1]
  const userMatch = url.match(/\/user\/([a-zA-Z0-9_.-]+)/)
  if (userMatch) return userMatch[1]
  return null
}

export async function resolveToChannelId(input: string, apiKey: string): Promise<string> {
  const trimmed = input.trim()

  // Video URL → resolve via video → channel
  const videoId = extractVideoId(trimmed)
  if (videoId) {
    const res = await fetch(`${BASE}/videos?part=snippet&id=${videoId}&key=${apiKey}`)
    const data = await res.json() as { items?: Array<{ snippet: { channelId: string } }> }
    if (data.items?.length) return data.items[0].snippet.channelId
    throw new Error('Video not found or is private.')
  }

  // Direct channel ID
  const channelId = extractChannelId(trimmed)
  if (channelId) return channelId

  // @handle
  const handle = extractChannelHandle(trimmed)
  if (handle) {
    const res = await fetch(
      `${BASE}/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`
    )
    const data = await res.json() as { items?: Array<{ id: string }> }
    if (data.items?.length) return data.items[0].id
  }

  // Custom URL / username / search fallback
  const custom = extractCustomUrl(trimmed)
  const searchQuery = custom ?? handle ?? trimmed
  const searchRes = await fetch(
    `${BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${apiKey}`
  )
  const searchData = await searchRes.json() as { items?: Array<{ snippet: { channelId: string } }> }
  if (searchData.items?.length) return searchData.items[0].snippet.channelId

  throw new Error('Could not find channel. Try pasting the @handle directly.')
}

// ── URL parsing ────────────────────────────────────────────────────────
type ParsedUrl =
  | { type: 'id';       value: string }
  | { type: 'handle';   value: string }
  | { type: 'username'; value: string }
  | { type: 'custom';   value: string }
  | { type: 'video';    value: string }  // videoId → resolve to channelId

function parseChannelUrl(raw: string): ParsedUrl {
  const cleaned = raw.trim()

  // Bare @handle (e.g. "@veritasium")
  if (cleaned.startsWith('@')) {
    return { type: 'handle', value: cleaned.slice(1) }
  }

  try {
    const u = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`)
    const path = u.pathname
    const hostname = u.hostname

    // youtu.be/[videoId] — short share URL
    if (hostname === 'youtu.be') {
      const videoId = path.slice(1).split('/')[0]
      if (videoId) return { type: 'video', value: videoId }
    }

    // watch?v=[videoId]
    const watchV = u.searchParams.get('v')
    if (watchV && (hostname.includes('youtube.com'))) {
      return { type: 'video', value: watchV }
    }

    // /shorts/[videoId]
    const shortsMatch = path.match(/\/shorts\/([\w-]+)/)
    if (shortsMatch) return { type: 'video', value: shortsMatch[1] }

    // /live/[videoId]
    const liveMatch = path.match(/\/live\/([\w-]+)/)
    if (liveMatch) return { type: 'video', value: liveMatch[1] }

    // /channel/UCxxxxxxxx
    const channelMatch = path.match(/\/channel\/(UC[\w-]+)/)
    if (channelMatch) return { type: 'id', value: channelMatch[1] }

    // /@handle
    const handleMatch = path.match(/\/@([\w.-]+)/)
    if (handleMatch) return { type: 'handle', value: handleMatch[1] }

    // /c/customname
    const customMatch = path.match(/\/c\/([\w.-]+)/)
    if (customMatch) return { type: 'custom', value: customMatch[1] }

    // /user/username
    const userMatch = path.match(/\/user\/([\w.-]+)/)
    if (userMatch) return { type: 'username', value: userMatch[1] }

  } catch {
    // fall through
  }

  return { type: 'custom', value: cleaned.replace(/^@/, '') }
}

// ── ISO 8601 duration → seconds ────────────────────────────────────────
export function parseDuration(iso: string | null | undefined): number {
  if (!iso) return 0
  // Handle days: P1DT2H3M4S
  const m = iso.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  const days    = parseInt(m[1] ?? '0')
  const hours   = parseInt(m[2] ?? '0')
  const minutes = parseInt(m[3] ?? '0')
  const seconds = parseInt(m[4] ?? '0')
  return days * 86_400 + hours * 3_600 + minutes * 60 + seconds
}

// ── Raw video shape (before scoring) ──────────────────────────────────
export interface RawVideo {
  id:          string
  title:       string
  thumbnail:   string
  views:       number
  likes:       number
  comments:    number
  duration:    number   // seconds
  publishedAt: string   // ISO date
  isShort:     boolean
}

// ── Resolve video URL → channelId ──────────────────────────────────────
async function resolveVideoToChannelId(videoId: string, key: string): Promise<string> {
  const res = await fetch(
    `${BASE}/videos?part=snippet&id=${videoId}&key=${key}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) {
    if (res.status === 403) throw new Error('YouTube API quota exceeded. Please try again later.')
    throw new Error(`YouTube API error: ${res.status}`)
  }
  const data = await res.json()
  if (!data.items?.length) throw new Error('Video not found or is private.')
  const channelId: string = data.items[0].snippet.channelId
  return channelId
}

// ── Fetch channel metadata ─────────────────────────────────────────────
export async function getChannel(url: string): Promise<{ channel: Channel; isVideoUrl: boolean }> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new Error('YOUTUBE_API_KEY is not configured')

  const parsed = parseChannelUrl(url)
  let isVideoUrl = false

  // Video URL → resolve channelId first
  if (parsed.type === 'video') {
    isVideoUrl = true
    const channelId = await resolveVideoToChannelId(parsed.value, key)
    return getChannel(`https://www.youtube.com/channel/${channelId}`)
  }

  const params: Record<string, string> = {
    part: 'snippet,statistics',
    key,
    maxResults: '1',
  }

  if      (parsed.type === 'id')       params.id          = parsed.value
  else if (parsed.type === 'handle')   params.forHandle   = parsed.value
  else if (parsed.type === 'username') params.forUsername = parsed.value
  else                                 params.forHandle   = parsed.value  // try handle for custom

  const qs  = new URLSearchParams(params).toString()
  const res = await fetch(`${BASE}/channels?${qs}`, { next: { revalidate: 3600 } })

  if (!res.ok) {
    if (res.status === 403) throw new Error('YouTube API quota exceeded. Please try again later.')
    if (res.status === 404) throw new Error('Channel not found.')
    throw new Error(`YouTube channels API error: ${res.status}`)
  }

  const data = await res.json()

  // Custom URLs may not resolve via forHandle — fall back to search
  if ((!data.items?.length) && (parsed.type === 'custom' || parsed.type === 'username')) {
    const searchRes = await fetch(
      `${BASE}/search?part=snippet&q=${encodeURIComponent(parsed.value)}&type=channel&maxResults=1&key=${key}`,
      { next: { revalidate: 3600 } }
    )
    if (!searchRes.ok) {
      if (searchRes.status === 403) throw new Error('YouTube API quota exceeded. Please try again later.')
      throw new Error(`YouTube search API error: ${searchRes.status}`)
    }
    const searchData = await searchRes.json()
    if (!searchData.items?.length) throw new Error('Channel not found. Check the URL and try again.')
    const channelId: string = searchData.items[0].id.channelId
    return getChannel(`https://www.youtube.com/channel/${channelId}`)
  }

  if (!data.items?.length) throw new Error('Channel not found. Check the URL and try again.')

  const ch      = data.items[0]
  const snippet = ch.snippet
  const stats   = ch.statistics

  if (stats.privacyStatus === 'private') {
    throw new Error('This channel is private and cannot be analyzed.')
  }

  const subscribers = parseInt(stats.subscriberCount ?? '0')
  const totalViews  = parseInt(stats.viewCount       ?? '0')
  const videoCount  = parseInt(stats.videoCount      ?? '1')
  const avgViews    = videoCount > 0 ? Math.round(totalViews / videoCount) : 0

  const handle = snippet.customUrl
    ? `@${snippet.customUrl.replace(/^@/, '')}`
    : `@${(snippet.title as string).replace(/\s+/g, '').toLowerCase()}`

  return {
    channel: {
      id:              ch.id,
      name:            snippet.title,
      handle,
      avatar:          snippet.thumbnails?.high?.url ?? snippet.thumbnails?.default?.url ?? '',
      subscribers,
      avgViews,
      uploadFrequency: 0,   // computed in analysis.ts from video dates
      engagementRate:  0,   // computed in analysis.ts from video stats
    },
    isVideoUrl,
  }
}

// ── Get channel by direct ID (no URL resolution needed) ───────────────
export async function getChannelById(channelId: string, apiKeyOverride?: string): Promise<Channel> {
  const { channel } = await getChannel(`https://www.youtube.com/channel/${channelId}`)
  void apiKeyOverride // key comes from env, override unused
  return channel
}

// ── Fetch up to 50 recent videos ──────────────────────────────────────
export async function getChannelVideos(channelId: string, maxResults = 50, apiKeyOverride?: string): Promise<RawVideo[]> {
  void apiKeyOverride
  return getVideos(channelId, maxResults)
}

export async function getVideos(channelId: string, maxResults = 50): Promise<RawVideo[]> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new Error('YOUTUBE_API_KEY is not configured')

  // Step 1 — search.list: ~100 quota units
  const searchRes = await fetch(
    `${BASE}/search?part=id&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${key}`,
    { next: { revalidate: 3600 } }
  )
  if (!searchRes.ok) {
    if (searchRes.status === 403) throw new Error('YouTube API quota exceeded. Please try again later.')
    throw new Error(`YouTube search API error: ${searchRes.status}`)
  }

  const searchData = await searchRes.json()
  if (!searchData.items?.length) return []

  const ids: string[] = (searchData.items as Array<{ id: { videoId: string } }>)
    .map((item) => item.id.videoId)
    .filter(Boolean)

  if (!ids.length) return []

  // Step 2 — videos.list: ~1 quota unit
  const videosRes = await fetch(
    `${BASE}/videos?part=snippet,statistics,contentDetails&id=${ids.join(',')}&key=${key}`,
    { next: { revalidate: 3600 } }
  )
  if (!videosRes.ok) {
    if (videosRes.status === 403) throw new Error('YouTube API quota exceeded. Please try again later.')
    throw new Error(`YouTube videos API error: ${videosRes.status}`)
  }

  const videosData = await videosRes.json()

  return (videosData.items ?? []).map((item: {
    id: string
    snippet: {
      title:        string
      publishedAt:  string
      description?: string
      thumbnails?:  {
        maxres?: { url: string }
        high?:   { url: string }
        default?:{ url: string }
      }
    }
    statistics: {
      viewCount?:    string
      likeCount?:    string
      commentCount?: string
    }
    contentDetails: { duration: string }
  }): RawVideo => {
    const duration = parseDuration(item.contentDetails.duration)
    const views    = parseInt(item.statistics.viewCount    ?? '0')
    const likes    = parseInt(item.statistics.likeCount    ?? '0')
    const comments = parseInt(item.statistics.commentCount ?? '0')

    const text = item.snippet.title + ' ' + (item.snippet.description ?? '')
    // 63-second threshold: some Shorts are slightly over 60s
    const isShort = duration <= 63 || /\#shorts?\b/i.test(text)

    const thumbnail =
      item.snippet.thumbnails?.maxres?.url ??
      item.snippet.thumbnails?.high?.url   ??
      item.snippet.thumbnails?.default?.url ?? ''

    return { id: item.id, title: item.snippet.title, thumbnail, views, likes, comments, duration, publishedAt: item.snippet.publishedAt, isShort }
  })
}
