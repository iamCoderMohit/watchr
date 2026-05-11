# watchr

Watch YouTube with your friends, live. Synced playback, voice & video chat, emoji reactions — all in one room.

---

## What it does

- Paste a YouTube link, everyone watches in perfect sync
- Voice and video chat with squircle webcam tiles
- Host controls play, pause, and seek — everyone follows
- Emoji reactions fly across the screen in real time
- Free for up to 4 people, Pro for up to 15
- No account needed to join a room

---

## Tech stack

| Layer | Service |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + CSS variables |
| Auth | Clerk |
| Video sync | YouTube IFrame API + Ably |
| Voice & video | LiveKit |
| Database | Upstash Redis |
| Payments | Razorpay |
| Deployment | Vercel |

---

## Project structure

```
watchr/
├── app/
│   ├── (marketing)/          # Public pages
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing page
│   ├── (auth)/               # Clerk auth pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (app)/                # Protected pages
│   │   ├── layout.tsx        # Shared navbar
│   │   ├── dashboard/        # User's rooms
│   │   └── room/[roomId]/    # Watch room
│   └── api/
│       ├── rooms/            # Create / get room
│       │   └── [roomId]/
│       │       ├── route.ts  # GET room
│       │       └── join/     # Check participant limit
│       ├── livekit/
│       │   ├── token/        # Mint LiveKit JWT
│       │   └── webhook/      # Track participant count
│       └── subscription/
│           ├── create/       # Create Razorpay order
│           └── verify/       # Verify payment + upgrade plan
│
├── components/
│   ├── ui/
│   │   └── Button.tsx
│   ├── Navbar.tsx
│   ├── landing/
│   │   ├── HeroCams.tsx      # Floating squircle cam tiles
│   │   ├── Features.tsx      # Feature grid section
│   │   ├── FeatureGrid.tsx   # Pricing cards
│   │   └── UpgradeButton.tsx # Razorpay checkout trigger
│   └── room/
│       ├── VideoPlayer.tsx   # YouTube IFrame wrapper
│       ├── CamGrid.tsx       # Webcam layout
│       ├── CamTile.tsx       # Single webcam tile
│       ├── Controls.tsx      # Mic/cam/react/invite bar
│       ├── UpgradePrompt.tsx # Shown when room is full
│       └── RoomShell.tsx     # Loading/error wrapper
│
├── hooks/
│   ├── useVideoSync.ts       # Ably play/pause/seek sync
│   ├── useLiveKit.ts         # Voice/video + participant state
│   ├── useRoom.ts            # Fetch room from API
│   └── useReactions.ts       # Emoji reactions via Ably
│
├── lib/
│   ├── ably.ts               # Ably client
│   ├── livekit.ts            # LiveKit token helper
│   ├── razorpay.ts           # Razorpay client
│   ├── redis.ts              # Upstash Redis client
│   └── plans.ts              # Plan definitions + user plan checker
│
├── middleware.ts              # Clerk auth + route protection
├── tailwind.config.ts
└── .env.local
```

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/iamCoderMohit/watchr.git
cd watchr
npm install
```

### 2. Set up services

You need accounts for 5 services — all have free tiers:

| Service | Link | What for |
|---|---|---|
| Clerk | clerk.com | Auth |
| Upstash | console.upstash.com | Redis database |
| Ably | ably.com | Video sync pub/sub |
| LiveKit | cloud.livekit.io | Voice & video |
| Razorpay | razorpay.com | Payments |

### 3. Environment variables

Create `.env.local` in the root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Ably
NEXT_PUBLIC_ABLY_API_KEY=xxx

# LiveKit
LIVEKIT_API_KEY=xxx
LIVEKIT_API_SECRET=xxx
NEXT_PUBLIC_LIVEKIT_URL=wss://xxx.livekit.cloud

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How to test locally with multiple users

**Two browser windows** — open the room in a normal window (host) and an incognito window (second user). Sign in with different Clerk accounts.

**Two devices on the same WiFi:**

```bash
# Find your local IP
ipconfig getifaddr en0   # mac
ipconfig                 # windows
```

Then open `http://192.168.x.x:3000/room/[roomId]` on another device.

---

## How video sync works

```
Host clicks play
  → emitPlay() called in useVideoSync
  → event published to Ably channel room:{roomId}
  → all subscribers receive the event
  → each client calls player.seekTo() + player.playVideo()
```

Ably is used purely as a signaling channel — the YouTube video plays independently on each client at the same timestamp. No video data is transmitted.

---

## How voice & video works

```
User joins room
  → /api/rooms/[roomId]/join checks participant count vs host's plan
  → if allowed, /api/livekit/token mints a JWT
  → client connects to LiveKit room
  → LiveKit webhook fires → Redis count incremented
  → camera/mic published via enableCameraAndMicrophone()
  → remote audio attached to <audio> elements in document.body
  → remote video rendered via track.attach() in CamTile
```

---

## Freemium model

| Feature | Free | Pro (₹500/month) |
|---|---|---|
| People per room | 4 | 15 |
| YouTube sync | ✓ | ✓ |
| Voice & video | ✓ | ✓ |
| Emoji reactions | ✓ | ✓ |
| Persistent rooms | — | ✓ |

Plan is stored in Redis as `user:{userId}:plan` with a 31-day expiry, refreshed on each payment. The participant limit is enforced server-side in the join route — it checks the host's plan, not the joiner's.

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### 2. Import to Vercel

Go to [vercel.com](https://vercel.com) → New Project → Import your repo.

### 3. Add environment variables

In Vercel → Settings → Environment Variables, add all the vars from `.env.local`.

> **Note on Clerk:** `*.vercel.app` domains are not supported on Clerk production instances. Either use a Clerk development instance (`pk_test_` keys) for `.vercel.app`, or buy a custom domain and add it as a Clerk production domain.

### 4. Add LiveKit webhook

In LiveKit dashboard → your project → Webhooks → Add endpoint:

```
https://your-domain.vercel.app/api/livekit/webhook
```

This keeps the participant count in Redis accurate for plan gating.

### 5. Deploy

```bash
vercel --prod
```

---

## Known issues / todos

- Mic toggle state doesn't always reflect correctly after toggling (cosmetic, audio still works)
- Participant count relies on LiveKit webhook — won't work on localhost without forwarding
- No room deletion UI (rooms expire automatically after 24h on free plan)
- Razorpay is test mode only until KYC is completed on razorpay.com

---

## License

MIT