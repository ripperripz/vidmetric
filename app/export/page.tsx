import { MOCK_ANALYSIS } from '@/src/lib/mockData'
import { fetchAnalysis } from '@/src/lib/fetchAnalysis'
import ExportPageClient from './ExportPageClient'

export default async function ExportPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>
}) {
  const { url } = await searchParams

  if (!url) {
    return (
      <ExportPageClient
        result={MOCK_ANALYSIS}
        sourceUrl=""
        errorBanner="Demo data — paste a YouTube channel URL on the home page."
      />
    )
  }

  const { result, error } = await fetchAnalysis(url)
  return <ExportPageClient result={result} sourceUrl={decodeURIComponent(url)} errorBanner={error} />
}
