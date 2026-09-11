import { standingsQuestion, statLeaderQuestion, draftQuestionGenerator, contractQuestionGenerator } from "./templates/questionGenerators.js";
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "./processor.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages } from './fetcher.js'
console.log('KEY LOADED:', process.env.BALLDONTLIE_API_KEY ? `yes, length ${process.env.BALLDONTLIE_API_KEY.length}` : 'NO — undefined')

await fetchTeamContracts(10, 2011)
console.log(getTopContractsByTeam(10, 2011))
console.log(contractQuestionGenerator(10, 2011))
