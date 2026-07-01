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

export { fetchAllPlayers }

