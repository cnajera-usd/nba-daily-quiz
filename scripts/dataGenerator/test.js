import { standingsQuestion, statLeaderQuestion, draftQuestionGenerator, contractQuestionGenerator } from "./templates/questionGenerators.js";
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "./processor.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages, fetchAllTeams } from './fetcher.js'
import { ensuredCache, tierPicker, pickSeasonFromTier, standingsTiers, randomContractQuestionGenerator, randomInRange,randomStandingsQuestionGenerator, randomDraftQuestionGenerator, randomStatLeaderQuestionGenerator, statLeaderTiers } from './dailyQuizGenerator.js'
console.log('KEY LOADED:', process.env.BALLDONTLIE_API_KEY ? `yes, length ${process.env.BALLDONTLIE_API_KEY.length}` : 'NO — undefined')


// Test the randomContractQuestionGenerator function
// console.log(await randomContractQuestionGenerator())


// Test the randomDraftQuestionGenerator function
// console.log(await randomDraftQuestionGenerator())

// Test the randomStatLeaderQuestionGenerator function
// console.log(await randomStatLeaderQuestionGenerator())

// Test the randomStandingsQuestionGenerator function

