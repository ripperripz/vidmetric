import { NextRequest, NextResponse } from 'next/server'
import { getChannel } from '@/src/lib/youtube'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    const channel = await getChannel(url)
    return NextResponse.json(channel)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch channel'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
