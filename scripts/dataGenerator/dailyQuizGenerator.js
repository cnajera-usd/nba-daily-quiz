import fs from 'fs';
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "./processor.js";
import { contractQuestionGenerator, draftQuestionGenerator } from "./templates/questionGenerators.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages, fetchAllTeams } from './fetcher.js'


function randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start
}

async function ensuredCache(path, fetchFn) {
    if (!fs.existsSync(path)) {
        console.log(`Cache not found for ${path}.`)
        console.log(`Fetching data and creating cache...`)
        await fetchFn()
        console.log(`Cache created for ${path}.`)
    }
}


const statLeaderTiers = { min: 1951, oldToMid: 1980, midToRecent: 2005, max: 2025 }
const standingsTiers = { min: 1970, oldToMid: 1985, midToRecent: 2001, max: 2025 }
const draftTiers = { min: 1950, oldToMid: 1980, midToRecent: 2001, max: 2025 }

function tierPicker() { 
    const chosenTier = Math.floor(Math.random() * 10)
    if (chosenTier <= 3) {
        return "recent"
    } else if (chosenTier > 3 && chosenTier <= 7) {
        return "mid"
    } else {
        return "old"
    }
}

function pickSeasonFromTier(tier, tiers) {
    let start, end
    if (tier === "recent") {
        start = tiers.midToRecent
        end = tiers.max
    } else if (tier === "mid") {
        start = tiers.oldToMid
        end = tiers.midToRecent - 1
    } else if (tier === "old") {
        start = tiers.min
        end = tiers.oldToMid - 1
    }
    return randomInRange(start, end)
}


async function randomContractQuestionGenerator() {
    const teamId = randomInRange(1, 30)
    const contractSeason = randomInRange(2011, 2025)


    const path = `scripts/dataGenerator/cache/contracts_${teamId}_${contractSeason}.json`
    await ensuredCache(path, () => fetchTeamContracts(teamId, contractSeason))

    
    return contractQuestionGenerator(teamId, contractSeason)
}

async function randomDraftQuestionGenerator() {

    const path = `scripts/dataGenerator/cache/players.json`
    await ensuredCache(path, () => fetchAllPlayers())


    let year = pickSeasonFromTier(tierPicker(), draftTiers)
        let pick = randomInRange(1, 60)
        let player = getPlayerByDraftPick(year, pick)
        let attempts = 0
    
        while (!player && attempts < 50) {
            year = pickSeasonFromTier(tierPicker(), draftTiers)
            pick = randomInRange(1, 60)
            player = getPlayerByDraftPick(year, pick)
            attempts++
        }

    return draftQuestionGenerator(year, pick)
    
}

export { ensuredCache, tierPicker, pickSeasonFromTier, randomContractQuestionGenerator, randomDraftQuestionGenerator, randomInRange, statLeaderTiers, standingsTiers, draftTiers }