# Feature idea: "Career-high scoring" question generator

## The question
"Who has the highest career-high scoring game among these players?"
- Show 4 real players as options (not just stars — mix of high and low career-high scorers)
- Don't show point totals in the options (keep it a guess)
- After the user answers, reveal the correct player's actual career-high point total

## Why this is different from the other 3 generators
`statLeaderQuestion`, `standingsQuestion`, and `draftQuestionGenerator` all read a
value the API already computed (rank, wins, draft position). This one requires
deriving a new value ourselves: a player's single-game scoring high, which means
scanning their full game-by-game stat history — no endpoint hands this to us directly.

## The real cost (confirmed, not guessed)
- Game Player Stats endpoint returns ~30,000 rows per season (30 teams x 82 games x ~10-12 players)
- Max 100 rows per page -> ~300 API requests to pull one full season
- BALLDONTLIE GOAT tier rate limit: **600 requests/minute** (confirmed via their docs)
- At a safe/conservative pace (~half the limit), one season ≈ 300 requests ≈ **~1 minute** of fetching
- 10-15 seasons ≈ **10-20 minutes total**, doable in one sitting — NOT a "one season a day for months" situation like we originally assumed before checking the actual rate limit

## The plan (once I'm back to actually build it)
1. **Precompute once, reuse forever** — build a separate batch script (not part of
   normal `test.js` iteration) that:
   - Fetches game-player-stats season by season (start with last 10-15 seasons)
   - For each player, tracks their max single-game `pts` seen so far
   - Writes the result to its own cache file, e.g. `cache/career_highs.json`
   - Is resumable — check what's already done before re-fetching, don't restart from zero on a crash
   - Logs progress as it goes (which season/page it's on) so a failure is diagnosable
2. Add basic throttling between requests (small delay) even though the rate limit is generous —
   cheap insurance, and something I meant to add to `fetcher.js` a while back anyway.
3. Once `career_highs.json` exists, the actual question generator becomes cheap/instant:
   - Read from the precomputed file (no live API calls needed at generation time)
   - Pick 4 players — mix of high and low career-highs so it's not always just superstars
   - Build the question the same way as the other 3 generators (indexed answers -> shuffle -> options/answer_index)
   - Category could be `'Records'` or similar

## Open questions to settle when I resume
- Exact selection weighting for "mix of high and low career-high players" (was leaning toward
  something like players with career-high > 50 more likely to be picked than those under 50 —
  but this requires the precomputed table to exist first, can't weight by something not computed yet)
- Whether to eventually expand past the initial 10-15 seasons
- Whether `career_highs.json` should store more than just points (rebounds/assists career-highs too?) —
  could make this a more general "career-high stat" system instead of points-only
