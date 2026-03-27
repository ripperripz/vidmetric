export interface Video {
  id: string
  title: string
  thumbnail: string
  views: number
  likes: number
  comments: number
  duration: number          // seconds
  publishedAt: string       // ISO date string
  isShort: boolean
  outlierScore: number      // 0-10, ratio vs channel average
  curiosityGapScore: number // 0-100, title pattern score
  ghostAudience: boolean    // true = creator never replied to comments
  formatGraveyard: boolean  // true = abandoned winning format
}

export interface Channel {
  id: string
  name: string
  handle: string
  avatar: string
  subscribers: number
  avgViews: number
  uploadFrequency: number   // videos per week
  engagementRate: number    // percentage
}

export interface WinFormula {
  postDay: string           // e.g. "Tuesday–Thursday"
  duration: string          // e.g. "14–17 min"
  titlePattern: string      // e.g. "Number in title"
}

export interface FormatGraveyardItem {
  formatName: string
  lastUsed: string          // e.g. "14 months ago"
  avgPerformance: number    // multiplier e.g. 4.2
  exampleTitle: string
}

export interface CadenceCell {
  day: string               // Mon–Sun
  time: string              // Morning/Afternoon/Evening/Night
  performance: number       // 0-1 normalized score
}

export interface AnalysisResult {
  channel: Channel
  videos: Video[]
  intelligenceBrief: string[]     // 6 bullet strings, first char = sentiment
  winFormula: WinFormula
  formatGraveyard: FormatGraveyardItem[]
  cadenceGrid: CadenceCell[]
  outlierScore: number
  shortsPercentage: number
  shortsViewShare: number
  postingCadence: string          // e.g. "every 4 days", "every 2 weeks", "inactive"
  generatedIn: number             // seconds
}
