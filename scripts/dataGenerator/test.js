import { statLeaderQuestion } from "./templates/scoring.js";
import { getLeaderByRank } from "./processor.js";
import { fetchLeaders} from './fetcher.js'


await fetchLeaders(2023, 'ast')
await fetchLeaders(2023, 'reb')
await fetchLeaders(2023, 'blk')
await fetchLeaders(2023, 'stl')
await fetchLeaders(2023, 'tov')

const question = statLeaderQuestion(2023, 'reb')

console.log(statLeaderQuestion(2023, 'reb'))
console.log(statLeaderQuestion(2023, 'blk'))
console.log(statLeaderQuestion(2023, 'stl'))
console.log(statLeaderQuestion(2023, 'tov'))
console.log(question)

/*
import { fetchStandings } from './fetcher.js'


const standings = await fetchStandings(2023)
console.log('First standing:', standings[0])

const leaders = await fetchLeaders(2023, 'pts')
console.log('First leader:', leaders[0])


const leader = getLeaderByRank(2023, 'pts', 1)
console.log(leader)
*/



