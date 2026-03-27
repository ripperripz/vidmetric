'use client'

export type SortOption =
  | 'Outlier Score'
  | 'Views'
  | 'Likes'
  | 'Comments'
  | 'Upload Date'
  | 'Curiosity Gap'

export type FilterOption =
  | 'All'
  | 'Shorts'
  | 'Long-Form'
  | 'Most Comments'
  | '>10M Views'
  | 'Format Graveyard'
  | 'Ghost Audience'

export type TimeOption = 'All Time' | 'Last 30 Days'

export interface SortFilterBarProps {
  activeTime: TimeOption
  activeSort: SortOption
  activeFilter: FilterOption
  onTimeChange: (time: TimeOption) => void
  onSortChange: (sort: SortOption) => void
  onFilterChange: (filter: FilterOption) => void
}

const SORT_OPTIONS: SortOption[] = [
  'Outlier Score',
  'Views',
  'Likes',
  'Comments',
  'Upload Date',
  'Curiosity Gap',
]

const FILTER_OPTIONS: FilterOption[] = [
  'All',
  'Shorts',
  'Long-Form',
  'Most Comments',
  '>10M Views',
  'Format Graveyard',
  'Ghost Audience',
]

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 4L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function filterChipStyle(filter: FilterOption, active: boolean): string {
  const base =
    'text-[12px] font-mono px-3 py-1 rounded-pill border transition-all duration-150 cursor-pointer whitespace-nowrap flex-shrink-0'

  if (!active) {
    return `${base} bg-surface-1 border-border-subtle text-text-secondary hover:border-border-strong hover:text-text-primary`
  }

  switch (filter) {
    case 'Format Graveyard':
      return `${base} bg-purple/10 border-purple/30 text-purple`
    case 'Ghost Audience':
      return `${base} bg-danger/10 border-danger/30 text-danger`
    case 'Shorts':
      return `${base} bg-accent/10 border-accent/30 text-accent`
    case 'Long-Form':
      return `${base} bg-success/10 border-success/30 text-success`
    case 'Most Comments':
      return `${base} bg-warning/10 border-warning/30 text-warning`
    default:
      return `${base} bg-accent border-accent text-background`
  }
}

export function SortFilterBar({
  activeTime,
  activeSort,
  activeFilter,
  onTimeChange,
  onSortChange,
  onFilterChange,
}: SortFilterBarProps) {
  return (
    <div className="w-full bg-surface-2 border border-border-subtle rounded-[8px] p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Time toggle */}
      <div className="flex items-center gap-1 flex-shrink-0 bg-surface-1 rounded-pill p-0.5">
        {(['All Time', 'Last 30 Days'] as TimeOption[]).map((t) => (
          <button
            key={t}
            onClick={() => onTimeChange(t)}
            className={`
              text-[12px] font-mono px-3 py-1 rounded-pill transition-all duration-150
              ${
                activeTime === t
                  ? 'bg-accent text-background font-medium'
                  : 'text-text-tertiary hover:text-text-secondary'
              }
            `}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="relative flex-shrink-0">
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="
            appearance-none bg-surface-1 border border-border-subtle rounded-[8px]
            text-[12px] font-mono text-text-secondary px-3 py-1.5 pr-7
            cursor-pointer hover:border-border-strong hover:text-text-primary
            transition-colors duration-150 focus:outline-none focus:border-accent
          "
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s} value={s}>
              Sort: {s} ↓
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary">
          <ChevronDown />
        </div>
      </div>

      {/* Filter chips — horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 pb-0.5 sm:pb-0">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={filterChipStyle(f, activeFilter === f)}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}
