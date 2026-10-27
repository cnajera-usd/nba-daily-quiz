# Idea: Question Cards & Collection Book

Status: idea only, not started (written 2026-10-26)

## The idea
Every quiz question becomes a collectible card. Each card has a difficulty
rating, which sets its rarity. Players keep the cards they've earned in a
"collection book" (inventory) they can browse.

## Why
- Gives players a reason to come back beyond the streak.
- Pairs with badges, the past-quiz archive and accounts.
- Gives the project a distinct identity (trading-card look, no copied style).

## How it could work
- **Difficulty rating:** percent of players who answered the question correctly.
  Until there is data, estimate by category or set it by hand in /admin.
- **Rarity tiers:** e.g. Common / Rare / Epic / Legendary, based on difficulty.
- **Earning cards:** collect a card when you answer it correctly (option:
  missed questions show as locked silhouettes you can come back for).
- **Collection book:** grid of cards, filter by category / rarity / date,
  completion counter (e.g. 47 / 310).
- **Card design:** category, question text, rarity accent (foil-style gradient),
  quiz date and number. Text only.

## Dependencies (build these first)
1. Accounts (so the collection survives across devices and browsers).
2. Answer logging, recorded anonymously per question, to compute difficulty.
3. Past-quiz archive (so old cards can be earned later).
4. Badges (cards and badges can share the same "achievements" screen).

## Technical notes
- New tables, e.g. question_stats (question_id, times_seen, times_correct) and
  user_cards (user_id, question_id, earned_at).
- Writes must go through a controlled path (RPC function or Supabase Edge
  Function), never open insert policies on the table. RLS stays strict.
- Add a difficulty / rarity column to questions, filled by a scheduled job once
  enough answers exist.

## Legal / design notes
- No player photos, no team logos, no NBA branding.
- Don't imitate Panini / Topps layouts; make the card design our own.
- Keep the "not affiliated with or endorsed by the NBA" disclaimer.

## Open questions
- Do missed questions give nothing, or a locked card?
- Is rarity fixed once set, or does it update as more players answer?
- Can the same card be earned twice (duplicates), or is one per question enough?
- Show other players' collection stats (leaderboard of completion)?

## Rough phases
1. Launch the quiz, then accounts.
2. Start anonymous answer logging.
3. Show difficulty on the results screen ("only 18% got this one").
4. Cards and rarity, then the collection book.
