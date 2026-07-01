# Zero Noise CEO OS — Frontend

A personal operating system for focus, growth, and execution. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Theme:** Light/Dark mode support

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages (16 Total)

### Public (3)
| # | Page | Route |
|---|------|-------|
| 1 | Landing | `/` |
| 2 | Login | `/login` |
| 3 | Signup | `/signup` |

### Protected (13)
| # | Page | Route |
|---|------|-------|
| 4 | Dashboard | `/dashboard` |
| 5 | Activities | `/activities` |
| 6 | Skills | `/skills` |
| 7 | Skill Detail | `/skills/[skillId]` |
| 8 | Deep Work | `/deep-work` |
| 9 | Goals | `/goals` |
| 10 | Goal Details | `/goals/[id]` |
| 11 | Edit Goal | `/goals/[id]/edit` |
| 12 | Daily Review | `/reviews/daily` |
| 13 | Weekly Review | `/reviews/weekly` |
| 14 | Monthly Review | `/reviews/monthly` |
| 15 | AI Coach | `/coach` |
| 16 | Settings | `/settings` |

## Design System

- **Primary:** `#1F3A5F`
- **Accent:** `#2E6F6E`
- **Font:** Inter, system-ui
- **Spacing:** 8px base unit
- **Radius:** 8px cards/buttons, 12px modals
- **Transitions:** 150ms ease
