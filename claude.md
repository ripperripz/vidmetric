# VidMetrics — Master Project Context

## What This Product Is
VidMetrics is a $499/month YouTube competitor intelligence SaaS for 
enterprise media companies, agencies, and content strategy teams.
A user pastes any YouTube channel URL and receives an instant 
intelligence brief — outlier videos, win formulas, momentum signals,
and competitive gaps. This is not a creator tool. The buyer is a 
Head of Content Strategy or VP at a major media company.

## Stack
- Framework: Next.js 14 App Router (NOT Pages Router)
- Language: TypeScript throughout — strict mode, zero `any` types
- Styling: Tailwind CSS only — all tokens in tailwind.config.js
- Charts: Recharts for complex charts, inline SVG for simple ones
- Images: next/image for all thumbnails and assets
- Fonts: next/font/google for all font loading
- API: YouTube Data API v3
- Deployment: Vercel
- No other libraries unless explicitly approved

## Design System

### Colors (use Tailwind token names, never raw hex)
| Token           | Hex       | Usage                          |
|-----------------|-----------|--------------------------------|
| background      | #080A0F   | Page background                |
| surface-1       | #0F1117   | Cards, panels                  |
| surface-2       | #161B25   | Elevated elements, inputs      |
| border-subtle   | #1E2433   | Default borders                |
| border-strong   | #2A3347   | Hover borders, emphasis        |
| text-primary    | #F0F2F7   | Headlines, primary text        |
| text-secondary  | #8B92A5   | Body text, descriptions        |
| text-tertiary   | #4A5168   | Labels, metadata, timestamps   |
| accent          | #4F7EFF   | CTAs, active states, links     |
| success         | #2DD4A7   | Growth, positive metrics       |
| warning         | #F5A623   | Outlier signals, amber alerts  |
| danger          | #FF4D6A   | Declining metrics, errors      |
| purple          | #A855F7   | Format Graveyard only          |

### Typography
- Display: Instrument Serif italic — hero headlines only, never UI
- UI: Geist or DM Sans — all navigation, labels, body text
- Mono: Geist Mono — ALL numbers, metrics, URLs, durations
- Rule: every number rendered anywhere uses className="font-mono"

### Spacing & Radius
- Card radius: 12px (rounded-xl)
- Pill radius: 999px (rounded-full)
- Input radius: 10px
- Standard card padding: 24px
- Section gap: 32px
- Component inner gap: 16px

### Dot Grid Background
```css
.dot-grid {
  background-image: radial-gradient(circle, #1E2433 1px, transparent 1px);
  background-size: 40px 40px;
}
```
Applied to: landing hero, login left panel, loading screen.

### Animations
All easing: cubic-bezier(0.16, 1, 0.3, 1)
- fadeUp: opacity 0→1 + translateY 24px→0, 400ms
- floatSlow: translateY 0→-8px→0, 4s infinite
- Card hover: translateY -4px, border-subtle→border-strong, 200ms
- Intelligence Brief hover row: bg→surface-2, 150ms

## File Structure
```
vidmetrics/
├── image/                          ← Stitch exports (read-only reference)
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                    ← Landing page
│   ├── analysis/
│   │   └── page.tsx                ← Results page
│   ├── login/
│   │   └── page.tsx                ← Login + onboarding
│   ├── export/
│   │   └── page.tsx                ← Export report page
│   └── api/
│       ├── channel/
│       │   └── route.ts            ← URL → channelId
│       └── videos/
│           └── route.ts            ← channelId → 50 videos
├── src/
│   ├── components/
│   │   ├── ChannelHeader.tsx
│   │   ├── IntelligenceBrief.tsx
│   │   ├── MetricCards.tsx
│   │   ├── VideoGrid.tsx
│   │   ├── VideoCard.tsx
│   │   ├── SortFilterBar.tsx
│   │   ├── CadenceHeatmap.tsx
│   │   ├── FormatGraveyard.tsx
│   │   └── LoadingScreen.tsx
│   ├── lib/
│   │   ├── mockData.ts             ← Single source of truth during dev
│   │   ├── analysis.ts             ← All scoring logic, zero API calls
│   │   ├── youtube.ts              ← YouTube API wrappers
│   │   └── utils.ts                ← Formatting helper functions
│   └── types/
│       └── index.ts                ← All shared TypeScript interfaces
├── tailwind.config.js
├── CLAUDE.md                       ← This file
└── .env.local                      ← YOUTUBE_API_KEY (never commit)
```

## TypeScript Interfaces
```typescript
interface Video {
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

interface Channel {
  id: string
  name: string
  handle: string
  avatar: string
  subscribers: number
  avgViews: number
  uploadFrequency: number   // videos per week
  engagementRate: number    // percentage
}

interface WinFormula {
  postDay: string           // e.g. "Tuesday–Thursday"
  duration: string          // e.g. "14–17 min"
  titlePattern: string      // e.g. "Number in title"
}

interface FormatGraveyardItem {
  formatName: string
  lastUsed: string          // e.g. "14 months ago"
  avgPerformance: number    // multiplier e.g. 4.2
  exampleTitle: string
}

interface CadenceCell {
  day: string               // Mon–Sun
  time: string              // Morning/Afternoon/Evening/Night
  performance: number       // 0-1 normalized score
}

interface AnalysisResult {
  channel: Channel
  videos: Video[]
  intelligenceBrief: string[]     // 6 bullet strings, first char = sentiment
  winFormula: WinFormula
  formatGraveyard: FormatGraveyardItem[]
  cadenceGrid: CadenceCell[]
  outlierScore: number
  shortsPercentage: number
  shortsViewShare: number
  generatedIn: number             // seconds
}
```

## All 12 Features

### MVP (build first)
1. **Intelligence Brief** — 6-bullet AI summary, signature feature, 
   3px left accent border with glow
2. **Outlier Score** — ratio of video views vs channel average, 0-10
3. **Momentum View** — 30-day vs 90-day view trajectory comparison
4. **Comment Goldmine** — flags videos with high comment-to-view ratio
5. **Shorts Split** — Shorts vs Long-form performance comparison
6. **Format Graveyard** — winning formats the channel abandoned (purple)
7. **Comeback Detector** — formats from 6-18 months ago that outperformed

### V2 (wire after MVP works)
8. **Win Formula Card** — 3 recurring patterns in top-performing videos
9. **Curiosity Gap Score** — title pattern effectiveness, 0-100
10. **Cadence Heatmap** — 7×4 grid when they post vs when they win
11. **Ghost Audience** — high-comment videos with zero creator replies
12. **Saturation Clock** — topic lifecycle: emerging→peaking→saturated
13. **Speed-to-Post Race** — how fast channel responds to trending topics

## Component Rules (apply to every component)
- TypeScript props interface at top, exported as named type
- No `any` types anywhere in the codebase
- Import mock data from src/lib/mockData.ts during dev phase
- All numbers: className="font-mono" — no exceptions
- All colors: Tailwind token classes only — zero hardcoded hex values
- Named exports (not default exports) for all components
- Hover states: translateY -4px + border-subtle→border-strong, 200ms
- All easing: cubic-bezier(0.16, 1, 0.3, 1)

## Utility Functions (src/lib/utils.ts)
```typescript
formatViews(n: number): string
// 1B+ → "1.2B" | 1M+ → "127M" | 1K+ → "84K" | else → n.toString()

formatDuration(seconds: number): string  
// Returns "14:23" format

relativeTime(isoDate: string): string
// Returns "3 days ago", "2 weeks ago", "4 months ago"

formatSubscribers(n: number): string
// Same as formatViews

getSentimentIcon(bullet: string): "up" | "down" | "warning" | "neutral"
// Parses first character: ↑ up | ↓ down | ⚠ warning | → neutral
```

## Backend Architecture
```
/api/channel/route.ts
  Input:  any YouTube channel URL (4 possible formats)
  Output: { channelId, name, handle, avatar, subscribers }
  Quota:  ~100 units
  Job:    URL parsing only — normalize to channelId

/api/videos/route.ts  
  Input:  channelId
  Output: Video[] (50 videos with full stats)
  Quota:  ~101 units (search.list + videos.list batch)
  Job:    Fetch only — zero analysis logic here

src/lib/analysis.ts
  Input:  Video[] + Channel
  Output: AnalysisResult
  Quota:  0 units — pure JavaScript, zero API calls
  Job:    All scoring, all intelligence, all pattern detection
  Rule:   This file must work with no internet connection
```

## Build Order (never deviate)
1. tailwind.config.js + globals.css + font setup
2. src/types/index.ts — all interfaces
3. src/lib/mockData.ts — complete mock AnalysisResult (50 videos)
4. src/lib/utils.ts — all formatting functions
5. Components (in this order):
   ChannelHeader → IntelligenceBrief → MetricCards → 
   SortFilterBar → VideoCard → VideoGrid → 
   CadenceHeatmap → FormatGraveyard → LoadingScreen
6. Pages (in this order):
   layout.tsx → login/page.tsx → page.tsx → 
   analysis/page.tsx → export/page.tsx
7. API routes: /api/channel → /api/videos
8. src/lib/analysis.ts — all scoring logic
9. Wire components to real API data
10. Deploy to Vercel

## Quality Gates (run after every phase)
- After Foundation: `npx tsc --noEmit` → zero errors
- After Components: `npm run dev` → all visible at localhost:3000
- After Pages: `npm run build` → zero build errors
- Final: `npm run lint` → zero lint errors

## Environment Variables
```
YOUTUBE_API_KEY=           ← Required. Get from Google Cloud Console.
```
Never commit .env.local. Always read from process.env.YOUTUBE_API_KEY.

## Golden Rules
1. Mock data first — API wiring is always the last step
2. Zero hardcoded hex values — Tailwind tokens only
3. All numbers in font-mono — no exceptions ever
4. Build order is strict — Foundation → Components → Pages → API
5. TypeScript strict mode — no `any`, no type assertions
6. One session = one goal — never mix foundation and API work
7. Run quality gates — never skip, never move on with errors
8. When Stitch HTML and these instructions conflict:
   HTML wins for: layout, element order, visual structure
   Instructions win for: token names, component names, TypeScript

## Gotchas (update this section as issues are found)
- Intelligence Brief left border: use border-l-4, NOT border, 
  to avoid overriding other sides
- Cadence heatmap cells: use aspect-square not fixed height
- Video thumbnails: always wrap in next/image with fill + 
  relative parent container
- Font mono: apply to the wrapper span, not just the number text
- Stagger animations: use style={{ animationDelay: `${i * 60}ms` }}
  not Tailwind delay classes (those don't accept dynamic values)