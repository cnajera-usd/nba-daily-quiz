# 🏀 NBA Daily Quiz

A daily NBA trivia quiz — 10 questions, new quiz every day, same questions for everyone.

## Tech Stack

- **Frontend**: React + Vite
- **Routing**: React Router v6
- **Backend**: Supabase (Postgres)
- **Fonts**: Barlow / Barlow Condensed (Google Fonts)

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/nba-daily-quiz.git
cd nba-daily-quiz
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and add your Supabase credentials (or leave blank to use local question data).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Supabase Setup (when ready)

### Create the `questions` table

```sql
create table questions (
  id bigint primary key generated always as identity,
  category text not null,
  question text not null,
  options jsonb not null,       -- array of 4 strings
  answer_index int not null,    -- 0–3
  created_at timestamptz default now()
);

-- Allow public read access (no auth needed to play)
alter table questions enable row level security;
create policy "Public read" on questions for select using (true);
```

### Seed initial questions

Import from `src/data/questions.js` or paste directly into the Supabase SQL editor.

---

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable: Button, Badge, ProgressBar, etc.
│   ├── quiz/        # QuestionCard, OptionButton, ScoreBar, etc.
│   └── layout/      # Shell, Header, etc.
├── data/
│   └── questions.js # Local question bank (fallback / dev)
├── hooks/
│   ├── useQuiz.js   # Core quiz state machine
│   └── useStreak.js # Daily streak tracking (localStorage)
├── lib/
│   └── supabase.js  # Supabase client init
├── pages/
│   ├── Home.jsx     # Landing / stats screen
│   ├── Quiz.jsx     # Active quiz screen
│   └── Results.jsx  # End-of-quiz results & share
├── styles/
│   └── index.css    # Global CSS + design tokens
└── utils/
    └── dailySeed.js # Date-based question selection
```

---

## How daily questions work

`dailySeed.js` generates a deterministic seed from today's date. The same seed
always shuffles the question pool the same way — so every player on the same day
gets the same 10 questions, no server coordination required.

---

## Roadmap

- [ ] Home page, Quiz page, Results page UI
- [ ] Share result (emoji grid like Wordle)
- [ ] Supabase question management
- [ ] User auth + leaderboard
- [ ] More question categories
- [ ] Difficulty tiers
