'use client'

import { useState, useMemo } from 'react'
import type { Video } from '@/src/types'
import { VideoCard } from '@/src/components/VideoCard'
import {
  SortFilterBar,
  type FilterOption,
  type SortOption,
  type TimeOption,
} from '@/src/components/SortFilterBar'

export interface VideoGridProps {
  videos: Video[]
}

function applyTimeFilter(videos: Video[], time: TimeOption): Video[] {
  if (time === 'All Time') return videos
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  return videos.filter((v) => new Date(v.publishedAt) >= cutoff)
}

function applyFilter(videos: Video[], filter: FilterOption): Video[] {
  switch (filter) {
    case 'Shorts':
      return videos.filter((v) => v.isShort)
    case 'Long-Form':
      return videos.filter((v) => !v.isShort)
    case 'Most Comments':
      return [...videos].sort((a, b) => b.comments - a.comments)
    case '>10M Views':
      return videos.filter((v) => v.views > 10_000_000)
    case 'Format Graveyard':
      return videos.filter((v) => v.formatGraveyard)
    case 'Ghost Audience':
      return videos.filter((v) => v.ghostAudience)
    default:
      return videos
  }
}

function applySort(videos: Video[], sort: SortOption): Video[] {
  const sorted = [...videos]
  switch (sort) {
    case 'Views':
      return sorted.sort((a, b) => b.views - a.views)
    case 'Likes':
      return sorted.sort((a, b) => b.likes - a.likes)
    case 'Comments':
      return sorted.sort((a, b) => b.comments - a.comments)
    case 'Upload Date':
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    case 'Curiosity Gap':
      return sorted.sort((a, b) => b.curiosityGapScore - a.curiosityGapScore)
    case 'Outlier Score':
    default:
      return sorted.sort((a, b) => b.outlierScore - a.outlierScore)
  }
}

export function VideoGrid({ videos }: VideoGridProps) {
  const [activeTime, setActiveTime] = useState<TimeOption>('All Time')
  const [activeSort, setActiveSort] = useState<SortOption>('Outlier Score')
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All')

  const displayedVideos = useMemo(() => {
    const afterTime = applyTimeFilter(videos, activeTime)
    const afterFilter = applyFilter(afterTime, activeFilter)
    // 'Most Comments' filter already sorts, but for consistency apply sort on top
    const afterSort =
      activeFilter === 'Most Comments' ? afterFilter : applySort(afterFilter, activeSort)
    return afterSort
  }, [videos, activeTime, activeFilter, activeSort])

  return (
    <section className="flex flex-col gap-4">
      <SortFilterBar
        activeTime={activeTime}
        activeSort={activeSort}
        activeFilter={activeFilter}
        onTimeChange={setActiveTime}
        onSortChange={setActiveSort}
        onFilterChange={setActiveFilter}
      />

      {displayedVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedVideos.map((video, i) => (
              <div
                key={video.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
          <p className="text-[12px] font-mono text-text-tertiary text-center pt-2">
            Showing {displayedVideos.length} of {videos.length} videos
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-border-subtle rounded-card bg-surface-1">
          <p className="text-text-tertiary text-sm">No videos match this filter.</p>
        </div>
      )}
    </section>
  )
}
