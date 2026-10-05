# Known gap: conference_rank doesn't resolve tiebreakers

## What we found
balldontlie's `conference_rank` gives tied teams the SAME rank number and skips
the next number. Example, 1995 East (the 1995-96 season) from the cache file:

    ranks seen: 1, 2, 3, 4, 4, 6, 6, 8, 9, 10, 11, 12, 13, 14, 15
    - Cavaliers and Knicks both rank 4, so nobody has rank 5
    - Hawks and Pistons both rank 6, so nobody has rank 7

Real playoff seeding gives every team a distinct seed, so the real order of the
tied teams differs from what the API shows (TODO: verify the actual 1995-96
seeds against Basketball Reference; I haven't checked them yet). The API
doesn't apply the NBA's real tiebreakers (head-to-head, division winners,
etc.), and this dataset doesn't contain the data needed to recompute them.

Note the tied teams also have identical overall records (Cavaliers and Knicks
both 47-35, Hawks and Pistons both 46-36), which is why the tie exists.

## What's already handled
- Crash fix: standingsQuestion's distractor loop skips rank numbers that don't
  resolve to a team, and randomStandingsQuestionGenerator re-rolls the main rank
  if it lands on a ghost number. 50-run test across 1970-2025: 0 failures.

## What's still a limitation
- getStandingByRank uses .find(), so a lookup for a tied rank always returns the
  same (first) team. The other tied team can never be the correct answer for
  that rank in that season (e.g. Pistons can't be "6th in the East, 1995").
- The "correct" team for a tied rank may not match the real historical seed.
  The question is consistent with its data source but not always with history.
- Division ranks likely have the same pattern in other seasons.

## Ideas for later
1. Detect duplicate rank values in a season/group and never use those ranks as
   the question target (safe, small coverage loss).
2. Find a data source with real playoff seeds and use it for the correct answer.
3. Keep reviewing each question before it goes live (current plan), and fix
   odd ones by hand.
