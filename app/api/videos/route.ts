import { NextRequest, NextResponse } from 'next/server'
import { getVideos } from '@/src/lib/youtube'

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get('channelId')
  if (!channelId) {
    return NextResponse.json({ error: 'Missing channelId parameter' }, { status: 400 })
  }

  try {
    const videos = await getVideos(channelId)
    return NextResponse.json(videos)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch videos'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
