import { fetchAllPlayers } from './fetcher.js'

const players = await fetchAllPlayers()
console.log('First player:', players[0])
