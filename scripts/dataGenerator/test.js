import { standingsQuestion, statLeaderQuestion } from "./templates/scoring.js";
import { getLeaderByRank, getStandingByRank } from "./processor.js";
import { fetchLeaders, fetchStandings} from './fetcher.js'
console.log('KEY LOADED:', process.env.BALLDONTLIE_API_KEY ? `yes, length ${process.env.BALLDONTLIE_API_KEY.length}` : 'NO — undefined')


/*await fetchLeaders(2023, 'ast')
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

try {
  getLeaderByRank(2099, 'pts', 1)
} catch (error) {
  console.log('Expected error:', error.message)
}
*/

await fetchLeaders(2018, 'pts')
await fetchStandings(2018)
await fetchStandings(2022)
console.log(standingsQuestion(2022, "conference", "West", 4))
console.log(standingsQuestion(2018, "conference", "East", 1))


