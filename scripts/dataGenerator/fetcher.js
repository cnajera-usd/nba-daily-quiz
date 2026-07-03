import fs from 'fs'
import 'dotenv/config'

const BASE_URL = 'https://api.balldontlie.io/nba/v1'

async function bdlFetch(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': process.env.BALLDONTLIE_API_KEY
    }
  })
  return res.json()
}


async function fetchAllPlayers() {
const players = []
let cursor = null
fs.mkdirSync('scripts/dataGenerator/cache', { recursive: true })
do {
  const data = await bdlFetch(`/players?per_page=100${cursor ? `&cursor=${cursor}` : ''}`)
  players.push(...data.data)
  cursor = data.meta.next_cursor
  console.log(`Fetched ${players.length} players so far...`)
} while (cursor)
console.log(`Done! Total players: ${players.length}`)

fs.writeFileSync('scripts/dataGenerator/cache/players.json', JSON.stringify(players))

return players
}


async function fetchSeasonAverages(season) {
const seasonAverages = []
let cursor = null
fs.mkdirSync('scripts/dataGenerator/cache', { recursive: true })
do {
    const data = await bdlFetch(`/season_averages/general?season=${season}&season_type=regular&type=base&per_page=100${cursor ? `&cursor=${cursor}` : ''}`)
    seasonAverages.push(...data.data)
    cursor = data.meta.next_cursor
    console.log(`Fetched ${seasonAverages.length} season averages so far...`)
} while (cursor)
console.log(`Done! Total season averages: ${seasonAverages.length}`)

fs.writeFileSync(`scripts/dataGenerator/cache/season_averages_${season}.json`, JSON.stringify(seasonAverages))

return seasonAverages
}

async function fetchLeaders(season, stat_type) {
    fs.mkdirSync('scripts/dataGenerator/cache', { recursive: true })
    const data = await bdlFetch(`/leaders?stat_type=${stat_type}&season=${season}&season_type=regular`)
    const leaders = data.data

    fs.writeFileSync(`scripts/dataGenerator/cache/leaders_${season}_${stat_type}.json`, JSON.stringify(leaders))
    console.log(`Done! Fetched ${leaders.length} leaders for ${stat_type} in ${season}`)

    return leaders
}

async function fetchStandings(season) {
    fs.mkdirSync('scripts/dataGenerator/cache', { recursive: true})
    const data = await bdlFetch(`/standings?season=${season}`)
    const standings = data.data

    fs.writeFileSync(`scripts/dataGenerator/cache/standings_${season}.json`, JSON.stringify(standings))
    console.log(`Done! Fetched ${standings.length} standings for ${season}`)

    return standings
    
}

export { fetchAllPlayers, fetchSeasonAverages, fetchLeaders, fetchStandings }


