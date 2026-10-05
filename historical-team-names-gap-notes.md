# Known gap: historical records appear under CURRENT franchise names

## What we found
The standings cache for the 1995 season (the 1995-96 season) labels teams with
today's names, not the names they had then:

    - 64-18 West champion shows as "Oklahoma City Thunder"
      (in 1995-96 that was the Seattle SuperSonics)
    - 15-67 shows as "Memphis Grizzlies"
      (in 1995-96 that was the Vancouver Grizzlies)
    - "Brooklyn Nets" for the New Jersey Nets
    - "Washington Wizards" for the Washington Bullets
    - "LA Clippers" and other current-era city/name labels

The team records are real; only the name/city label is the modern one.

## Why it matters
A question like "Which team finished 1st in the Western Conference in 1995?"
would list "Oklahoma City Thunder" as the correct answer. Oklahoma City didn't
have a team until 2008, so a fan will read that as wrong. The question stays
consistent with its data source but isn't historically accurate, which is what
this project is trying to protect.

## Likely scope
- standingsQuestion: affected directly (answers are team names)
- contractQuestionGenerator: probably unaffected (data starts in 2011, and
  the relocations were 2008 and 2012-13, so check Brooklyn 2011 and New Orleans)
- statLeaderQuestion / draftQuestionGenerator: answers are player names, so
  mostly unaffected

## Current plan
- I review every question before it goes live, so an easy catch like this can
  be fixed by hand. That means the daily script should save questions as
  'pending' instead of 'approved' until I've signed off.

## Ideas for later
1. Build a small lookup of (team id, season range) to historical name
   (e.g. id 21: Seattle SuperSonics through 2007, Oklahoma City Thunder after)
   and use it when building the answer options.
2. Only ask standings questions for seasons from 2013 on, where names match.
3. Also check whether balldontlie labels each team's conference using that
   season's real alignment or today's (compare a 1975 cache file against
   Basketball Reference: Milwaukee and Chicago played in the West in the 1970s).
