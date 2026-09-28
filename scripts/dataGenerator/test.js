import { standingsQuestion, statLeaderQuestion, draftQuestionGenerator, contractQuestionGenerator } from "./templates/questionGenerators.js";
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "./processor.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages, fetchAllTeams } from './fetcher.js'
import { ensuredCache, tierPicker } from './dailyQuizGenerator.js'
console.log('KEY LOADED:', process.env.BALLDONTLIE_API_KEY ? `yes, length ${process.env.BALLDONTLIE_API_KEY.length}` : 'NO — undefined')


let recentCount = 0
let midCount = 0
let oldCount = 0

for (let i = 0; i < 100; i++) {
  const tier = tierPicker()
  if (tier === 'recent') {
    recentCount++
  } else if (tier === 'mid') {
    midCount++
  } else {
    oldCount++
  }
  console.log(`Recent: ${recentCount}, Mid: ${midCount}, Old: ${oldCount}`)
}