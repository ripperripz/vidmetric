import { MOCK_ANALYSIS } from '@/src/lib/mockData'
import { fetchAnalysis } from '@/src/lib/fetchAnalysis'
import ExportPageClient from './ExportPageClient'

export default async function ExportPage({
  searchParams,
}: {
  searchParams: { url?: string }
}) {
  const url = searchParams.url
  const { result, error } = url
    ? await fetchAnalysis(url)
    : { result: MOCK_ANALYSIS, error: 'Demo data — paste a YouTube channel URL on the home page.' }

  return <ExportPageClient result={result} sourceUrl={url ?? ''} errorBanner={error} />
}
