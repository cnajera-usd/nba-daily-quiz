# Known gap: old standings questions can have wrong answers (conference labels)

STATUS: partly confirmed from the 1977 cache. The `conference_rank` values don't
line up with the `conference` labels (San Antonio 29-11 and Denver 22-18 are both
"West" rank 2; Houston is "West" rank 9 and Detroit is "East" rank 9). Which real
conference each team was in still isn't verified against Basketball Reference.

## What happened
First full run of generateDailyQuiz() produced two wrong standings questions, both
from before 1980:
- "Which team finished 3rd in the Western Conference in the 1978 season?"
  - Data's answer: Houston Rockets. Real answer (per me): Phoenix Suns, which
    wasn't even in the options.
- "Which team finished 9th in the Western Conference in the 1977 season?"
  - Data's answer: Houston Rockets. Real answer (per me): Detroit Pistons, which
    wasn't in the options.

## Suspected cause
- `conference_rank` seems to follow the conference each team was really in that
  season.
- `team.conference` on each row seems to be TODAY's conference label.
- Our code filters by `team.conference`, so it mixes two different alignments.
- Examples: Houston was in the East until 1980 but is labeled West today, so it
  gets pulled into the West list carrying its East rank. Detroit was in the West
  in the 1970s but is labeled East today, so it is filtered out of the West list.
- The 50-run test only checked for crashes, not for correct answers, so it passed.

## How to confirm (do this first)
Look at the 1977 standings cache: for each team, check name, `conference` label,
`conference_rank` and record. Compare against Basketball Reference's 1977-78
West standings.

## Affected code
- standingsQuestion (wrong or missing answers)
- getMaxRankForGroup (counts rows by today's label, so max rank can be wrong)
- randomStandingsQuestionGenerator (inherits both)

## Options
1. TEMPORARY FIX: raise the standings floor in `standingsTiers` to about 2004
   (after the last realignment; same year division data starts). One-line change,
   plus rechecking the tier boundaries. Loses older standings questions.
2. PROPER FIX LATER: build a lookup of (team, season range) to the real
   conference, and use it instead of `team.conference` for old seasons. Then the
   floor can go back down.
3. Not recommended: leave it and catch errors in manual review (these are wrong
   answers, not just odd names).

## Plan
Confirm the cause, apply option 1 for now, come back to option 2 later.

Related: `historical-team-names-gap-notes.md` (item 3 there flagged this
conference-label question) and `standings-tiebreaker-gap-notes.md`.
