# Hanyu Journal (汉语日记)

A personal Chinese vocabulary learning journal built with Next.js + Tailwind CSS.

## What It Does
Helps retain Chinese words and phrases learned through Duolingo by providing a personal vocabulary journal with flashcard and quiz review modes.

## Pages
- `/` — Dashboard: stats, recent words, quick links
- `/add` — Add a new word or phrase (form)
- `/vocab` — Browse all vocabulary with search and filter
- `/vocab/[id]` — Individual word/phrase detail page (dynamic route)
- `/review` — Review mode with flashcard flip and multiple choice quiz
- `/practice` — Sentence builder with free practice and reconstruction game
- `/progress` — Progress tracking with mastery %, category breakdown, visual bars

## Data Model
Each vocabulary entry has:
- `id` (string) — unique identifier
- `chinese` (string) — Chinese characters (e.g. "你好")
- `pinyin` (string) — romanized pronunciation (e.g. "nǐ hǎo")
- `english` (string) — English meaning (e.g. "hello")
- `example` (string, optional) — example sentence
- `category` (string) — tag like "greetings", "food", "travel"
- `mastered` (boolean) — whether the word is mastered
- `createdAt` (string) — ISO date of when it was added

Data is stored in React Context (client-side state only — resets on refresh).

## Style
Warm and friendly design — soft greens, cream background, rounded corners, approachable like Duolingo.

## Tech Stack
- Next.js (App Router) with TypeScript
- Tailwind CSS
- React Context for state management
