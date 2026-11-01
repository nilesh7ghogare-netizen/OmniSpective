# OmniSpective — Ambient Global Telemetry Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

**OmniSpective** is a real-time, glassmorphic ambient global telemetry web application that synthesizes live planetary signals across geophysics, atmospheric sciences, chronological time anchors, and fine arts into an adaptive masonry grid.

---

## ⚡ Live Telemetry Nodes (Zero-Config Public APIs)

| Node | Source | Endpoint | Description |
|---|---|---|---|
| 🌍 **Seismic Pulse** | USGS | `summary/all_hour.geojson` | Real-time tremors, peak Richter scale magnitude, hypocenter depth gauge, and acoustic wave radar |
| 🎨 **Artisan Dispatch** | The Met | `collection/v1/objects` | Open-access museum masterpieces with high-res imagery, historical metadata, and random discovery shuffle |
| ⏱️ **Chrono-Anchor** | World Time API + Resilient Atomic Clock | `/api/ip` + fallback | Live ticking sub-second master clock, UTC anchor, epoch milliseconds, and multi-timezone tickers (Tokyo, London, NYC) |
| 🌤️ **Atmosphere** | Open-Meteo | `forecast?current=temperature_2m,wind_speed_10m` | Isobaric ambient temperature, 10m wind vector compass, Beaufort scale, and interactive global coordinate switcher |

---

## ✨ Features & Architecture

- **Cyber-Glassmorphism**: Dark ambient void aesthetic (`#060911`) featuring backdrop-blur-xl frosted glass panels, ambient radial glows, and interactive hover elevation.
- **Dynamic Masonry Layout**: Multi-column fluid masonry layout (`columns-1 md:columns-2 lg:columns-3 xl:columns-3 gap-6`) avoiding layout reflows and optimizing visual rhythm.
- **Real-Time Ticking Master Loop**: High-precision sub-second chronological ticker that updates UTC, local time, and global timezones without re-rendering unrelated cards.
- **Google AdSense Ready**: Native `<ins class="adsbygoogle" ...>` HTML containers styled seamlessly like ambient partner telemetry dispatches, with zero layout shift and automatic script execution.
- **Resilient Data Synthesis**: Multi-tier server and client-side fallback system protecting against external API downtime (such as worldtimeapi.org network drops).
- **Vercel & GitHub Ready**: Pre-configured build pipelines, Turbopack support, optimized image caching, and zero external database requirements.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or newer
- npm or pnpm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/omnispective.git

# Navigate to project directory
cd omnispective

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables (Optional)

Configure Google AdSense in `.env.local`:

```env
# Google AdSense Publisher Client ID
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Ad Slot IDs
NEXT_PUBLIC_ADSENSE_SLOT_1=8932014571
NEXT_PUBLIC_ADSENSE_SLOT_2=9842103562
```

---

## 📦 Deployment to Vercel

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial OmniSpective ambient telemetry release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/OmniSpective.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Click **Deploy**. Vercel will build and launch OmniSpective automatically!

---

## 📄 License
MIT © OmniSpective
