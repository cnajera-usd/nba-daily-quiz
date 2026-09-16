import { standingsQuestion, statLeaderQuestion, draftQuestionGenerator, contractQuestionGenerator } from "./templates/questionGenerators.js";
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "./processor.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages } from './fetcher.js'
console.log('KEY LOADED:', process.env.BALLDONTLIE_API_KEY ? `yes, length ${process.env.BALLDONTLIE_API_KEY.length}` : 'NO — undefined')



console.log(contractQuestionGenerator(9, 2018))



