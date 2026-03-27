import { MOCK_ANALYSIS } from '@/src/lib/mockData'
import { fetchAnalysis } from '@/src/lib/fetchAnalysis'
import AnalysisLayout from './AnalysisClient'
import AnalysisError from './AnalysisError'

// ── Page ─────────────────────────────────────────────────────────────
export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>
}) {
  const { url } = await searchParams

  if (!url) {
    return (
      <AnalysisLayout
        result={MOCK_ANALYSIS}
        sourceUrl=""
        errorBanner="Demo data — paste a YouTube channel URL on the home page to analyse a real channel."
      />
    )
  }

  try {
    const { result, error, isVideoUrl } = await fetchAnalysis(url)
    const infoBanner = isVideoUrl
      ? 'Analyzed channel from video link.'
      : undefined

    return (
      <AnalysisLayout
        result={result}
        sourceUrl={decodeURIComponent(url)}
        errorBanner={error ?? infoBanner}
        isInfo={!!infoBanner && !error}
      />
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
    return <AnalysisError message={message} url={decodeURIComponent(url)} />
  }
}
