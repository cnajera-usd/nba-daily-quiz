import fs from 'fs';
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "./processor.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages, fetchAllTeams } from './fetcher.js'


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



export { ensuredCache, tierPicker }