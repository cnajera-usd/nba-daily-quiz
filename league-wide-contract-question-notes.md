# Feature idea: League-wide contract question (v2 of contract questions)

## Context
Built first: a team-scoped contract question — "Which player made $X on the
[team] in [season]?" — using the existing per-team, per-season cache file
(`fetchTeamContracts(season, team_id)`), same as `getContractsByTeam` style
lookups. This works with the data already being fetched, one API call per
team/season, no extra infrastructure.

## The v2 idea: mix players from ANY team, not just one roster
Instead of "guess the salary among 4 teammates," ask "guess the salary among
4 players pulled from anywhere in the league." More variety, less predictable
than always comparing teammates who are often in a similar pay tier already
(e.g. bench players naturally cluster near each other in salary within one
roster, which can make distractors too easy/obvious).

## Why this needs more than what's already built
The team-scoped version only ever reads ONE cached file (one team, one season)
per question. To pick 4 random players from across the whole league for a
given season, you'd need contract data cached for MANY teams — not just
whichever team happens to be the "correct answer" team.

## Two ways to get there
1. **Fetch all 30 teams' contracts for a season up front, cache them all** —
   30 `fetchTeamContracts(season, team_id)` calls (loop over every team_id 1-30),
   each writing its own cache file (already how the fetcher works, no changes
   needed to `fetchTeamContracts` itself — just call it in a loop across teams).
   This is NOT the same scale problem as the career-high idea — 30 calls per
   season is small and fast (well under a minute even one at a time, given
   the 600 req/min GOAT rate limit). Totally doable in one run, no throttling
   worries, no multi-day plan needed.
2. **Fetch on-demand per question** — call the API live, multiple times, every
   time a league-wide question is generated. Simpler to write, but slower per
   question and doesn't build reusable cache the way the rest of this project
   does. Probably not worth it given option 1 is cheap.

## Recommended approach when I come back to this
Go with option 1 — a small batch step (loop `fetchTeamContracts(season, teamId)`
across all 30 team IDs for whichever season(s) I want league-wide questions for),
same pattern as `fetchAllPlayers`/other fetchers, just looped. Once all 30 team
files exist for a season, the question generator can:
- Read all 30 cache files for that season
- Combine into one big pool of player contracts
- Apply the same `rank !== 0` filter (skip unranked/irrelevant players) used
  in the team-scoped version
- Pick 1 correct player + 3 distractors from anywhere in that combined pool
  (could still weight distractors toward "similar cap_hit" for difficulty,
  same idea as the team-scoped version — just pulling from a much bigger pool)

## Open questions to settle when I resume
- Need a full team ID list (1-30) somewhere reusable — check if this already
  exists anywhere in the project (e.g. from earlier `fetchAllTeams`-type calls)
  or needs to be hardcoded/fetched once via the Teams endpoint
- Whether to build this per-season on demand, or pre-fetch a handful of
  "popular" seasons up front (mirrors the same design question from the
  career-high idea, but much lower stakes here given the small fetch size)
