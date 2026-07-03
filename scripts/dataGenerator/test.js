import { fetchStandings } from './fetcher.js'
import { fetchLeaders} from './fetcher.js'

const standings = await fetchStandings(2023)
console.log('First standing:', standings[0])

const leaders = await fetchLeaders(2023, 'pts')
console.log('First leader:', leaders[0])


