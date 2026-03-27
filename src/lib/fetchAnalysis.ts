import type { AnalysisResult } from '@/src/types'
import { MOCK_ANALYSIS } from './mockData'
import { getChannel, getVideos } from './youtube'
import { analyze } from './analysis'

export interface FetchResult {
  result: AnalysisResult
  usingMock: boolean
  isVideoUrl?: boolean
  error?: string
}

export async function fetchAnalysis(url: string): Promise<FetchResult> {
  // Explicit mock mode — only when env var is set
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    return { result: MOCK_ANALYSIS, usingMock: true }
  }

  if (!process.env.YOUTUBE_API_KEY) {
    // Dev fallback: show demo data with a clear banner
    return {
      result: MOCK_ANALYSIS,
      usingMock: true,
      error: 'No API key configured — showing demo data. Add YOUTUBE_API_KEY to .env.local to analyze real channels.',
    }
  }

  const { channel, isVideoUrl } = await getChannel(url)
  const rawVideos = await getVideos(channel.id)
  const result = analyze(rawVideos, channel)
  return { result, usingMock: false, isVideoUrl }
}
