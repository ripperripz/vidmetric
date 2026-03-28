# Vexel — YouTube Competitor Intelligence

> Know why your competitor wins.

Vexel is a YouTube competitor intelligence platform for enterprise media teams and agencies. Paste any YouTube channel URL and get an instant intelligence brief with outlier detection, win formulas, and momentum signals.

## Live Demo

[vexel.vercel.app](https://vexel.vercel.app)

## Features

### Core
- **Channel Analysis** — Paste any YouTube URL format
- **Video Grid** — All videos with key metrics (views, likes, comments, duration, publish date)
- **Sorting** — By outlier score, views, likes, comments, upload date, curiosity gap
- **Filtering** — All, Shorts, Long-Form, Most Comments, >10M Views, Format Graveyard, Ghost Audience

### Unique Intelligence Features
- **Intelligence Brief** — 6-bullet AI-generated analyst-grade summary
- **Outlier Score** — How much a video beats the channel median (0-10x)
- **Curiosity Gap Score** — Title psychology scoring (0-100)
- **Win Formula** — Pattern detection across top performers (best day, duration, title pattern)
- **Upload Cadence Heatmap** — 7x4 grid showing when they post vs when they win
- **Format Graveyard** — Winning formats the channel abandoned
- **Shorts Intelligence** — Format performance split with view share analysis
- **Performance Charts** — Views over time + outlier distribution (Recharts)
- **Trending Indicators** — Outlier/High Demand badges per video

### Additional Features
- **Export** — PDF (print), CSV, and JSON download with white-label branding
- **Save Analyses** — Bookmark channels to localStorage for quick re-analysis
- **Responsive Design** — Full mobile support with hamburger sidebar
- **3D Background** — Interactive particle network (Three.js) on landing page
- **Custom Cursor** — Dot + ring cursor with hover states

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **3D**: Three.js
- **Animations**: Framer Motion
- **Data**: YouTube Data API v3
- **Deploy**: Vercel

## Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/vexel
   cd vexel
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create environment file
   ```bash
   cp .env.example .env.local
   ```

4. Add your YouTube API key to `.env.local`
   ```
   YOUTUBE_API_KEY=your_key_here
   ```
   Get a free key at [console.cloud.google.com](https://console.cloud.google.com).
   Enable: YouTube Data API v3.
   Free tier: 10,000 units/day. Each analysis uses ~4 units.

5. Run development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  page.tsx              Landing page
  analyze/page.tsx      New analysis input
  analysis/             Analysis results
  dashboard/page.tsx    Home dashboard
  saved/page.tsx        Saved analyses
  export/               Export reports (PDF/CSV/JSON)
  settings/page.tsx     Configuration
  login/page.tsx        Login page
  api/
    channel/route.ts    URL -> channelId resolver
    videos/route.ts     channelId -> 50 videos fetcher
src/
  components/
    ChannelHeader.tsx       Channel overview card
    IntelligenceBrief.tsx   6-bullet AI summary
    MetricCards.tsx          Key metric cards
    VideoGrid.tsx           Video grid with sort/filter
    VideoCard.tsx           Individual video card
    SortFilterBar.tsx       Sort + filter controls
    PerformanceChart.tsx    Recharts views + outlier charts
    CadenceHeatmap.tsx      7x4 posting heatmap
    FormatGraveyard.tsx     Abandoned formats list
    LoadingScreen.tsx       Analysis loading screen
    AppSidebar.tsx          Navigation sidebar
    ThreeBackground.tsx     3D particle network
  lib/
    analysis.ts         All scoring logic (zero API calls)
    youtube.ts          YouTube API wrappers
    mockData.ts         Development mock data
    utils.ts            Formatting helpers
  types/
    index.ts            TypeScript interfaces
```

## How It Works

1. User pastes any YouTube URL
2. `/api/channel` resolves URL to channel ID (supports @handle, /channel/UC..., video URLs)
3. `/api/videos` fetches 50 most recent videos via `playlistItems.list` + `videos.list`
4. `analysis.ts` computes all metrics client-side (outlier scores, win formula, cadence, intelligence brief)
5. Results render with charts, sorted video grid, and exportable report

## YouTube URL Formats Supported

- `youtube.com/@handle`
- `youtube.com/channel/UC...`
- `youtube.com/c/customname`
- `youtube.com/watch?v=videoId` (resolves to channel)
- `youtube.com/shorts/videoId` (resolves to channel)
- `youtu.be/videoId` (resolves to channel)
- Plain `@handle` text
