# XO Game — Tic-Tac-Toe

A production-quality Tic-Tac-Toe web application built with Next.js 16, featuring an unbeatable AI opponent, real-time game state management, parallax landing page, and match history.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Icons:** Lucide React
- **Fonts:** Space Grotesk (headings) + Inter (body) via `next/font`
- **State:** React hooks + server-validated game state
- **Package Manager:** pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint

# Production build
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with fonts and metadata
│   ├── page.tsx                # Landing page (parallax hero)
│   ├── game/
│   │   ├── page.tsx            # Game page (client component)
│   │   ├── loading.tsx         # Loading skeleton
│   │   └── error.tsx           # Error boundary
│   └── api/game/               # RESTful API routes
│       ├── route.ts            # POST: create game
│       ├── [id]/route.ts       # GET: game state, PUT: make move
│       └── history/route.ts    # GET: match history
├── components/
│   ├── ui/                     # Button, Modal
│   ├── game/                   # Board, Cell, ScoreBoard, GameStatus, HistoryPanel
│   ├── landing/                # Hero, Features, HowToPlay, Footer
│   └── layout/                 # Navbar
├── hooks/
│   ├── useGame.ts              # Game state management
│   ├── useParallax.ts          # CSS transform parallax effect
│   └── useScrollAnimation.ts   # Intersection Observer animations
├── lib/
│   ├── game-engine.ts          # Pure game logic + minimax AI
│   ├── game-repository.ts      # Repository pattern (in-memory storage)
│   ├── api-client.ts           # Typed fetch wrapper
│   └── utils.ts                # cn() helper, ID generation
├── types/
│   └── game.ts                 # All TypeScript interfaces
└── styles/
    └── globals.css             # Design tokens, animations, Tailwind config
```

## Design Decisions

### Architecture

- **Server-validated moves:** All game moves go through the API, which validates turns, checks for winners, and runs AI logic server-side. The client is a thin presentation layer.
- **Repository pattern:** Game storage uses an interface (`GameRepository`) with an in-memory implementation. A database (Postgres, Redis) can be swapped in by implementing the same interface.
- **Pure game engine:** All game logic (`checkWinner`, `minimax`, etc.) lives in `game-engine.ts` as pure functions with no side effects — easy to test and reason about.

### AI

- **Hard mode:** Minimax algorithm with alpha-beta pruning. Evaluates all possible game states to find the optimal move. Unbeatable.
- **Easy mode:** Random move selection from available cells.

### UI/UX

- **SVG mark animations:** X and O marks are drawn with CSS `stroke-dashoffset` animations for a satisfying hand-drawn feel.
- **Parallax landing page:** CSS transforms + requestAnimationFrame. Automatically disabled on mobile and when `prefers-reduced-motion` is set.
- **Scroll animations:** Intersection Observer triggers entrance animations for feature cards and content sections.
- **Design tokens:** CSS custom properties define the color palette, enabling easy theming.

### Performance

- `React.memo` on Board and Cell components to prevent unnecessary re-renders
- Passive scroll listeners for parallax
- `requestAnimationFrame` for smooth scroll-linked animations
- Server Components used for landing page sections where possible
