import fs from 'fs';
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam, getMaxRankForGroup } from "./processor.js";
import { contractQuestionGenerator, draftQuestionGenerator, statLeaderQuestion, standingsQuestion } from "./templates/questionGenerators.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages, fetchAllTeams } from './fetcher.js'
import { loadESLint } from 'eslint';


function randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start
}

const statTypeAvailability = {
    pts: 1951,
    reb: 1951,
    ast: 1951,
    stl: 1974,
    blk: 1974,
    tov: 1978
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



function getValidStatTypes(season) {
    const allStatTypes = Object.keys(statTypeAvailability)
    const validStatTypes = allStatTypes.filter((key) => season >= statTypeAvailability[key])
    return validStatTypes

}

async function randomStatLeaderQuestionGenerator() {
    const season = pickSeasonFromTier(tierPicker(), statLeaderTiers)
    const validStatTypes = getValidStatTypes(season)
    const validStatType = validStatTypes[Math.floor(Math.random() * validStatTypes.length)]

    const path = `scripts/dataGenerator/cache/leaders_${season}_${validStatType}.json`
    await ensuredCache(path, () => fetchLeaders(season, validStatType))

    return statLeaderQuestion(season, validStatType)



}


async function randomStandingsQuestionGenerator() {
    let season = pickSeasonFromTier(tierPicker(), standingsTiers)
    let attempts = 0
    while ((season === 2011 || season === 2020) && attempts < 10) {
        season = pickSeasonFromTier(tierPicker(), standingsTiers)
        attempts++

    }

    const path = `scripts/dataGenerator/cache/standings_${season}.json`
    await ensuredCache(path, () => fetchStandings(season))

    let groupType
    if (season < 2004) {
        groupType = 'conference'
    } else {
        const typeOptions = ['conference', 'division']
        groupType = typeOptions[Math.floor(Math.random() * typeOptions.length)]
    }

    let groupValue
    if (groupType === 'conference') {
        const conferenceOptions = ['East', 'West']
        groupValue = conferenceOptions[Math.floor(Math.random() * conferenceOptions.length)]
    } else {
        const divisionOptions = ['Atlantic', 'Central', 'Southeast', 'Northwest', 'Pacific', 'Southwest']
        groupValue = divisionOptions[Math.floor(Math.random() * divisionOptions.length)]
    }

    
    const maxRank = getMaxRankForGroup(season, groupType, groupValue)
    let rank = randomInRange(1, maxRank)
    let standing = getStandingByRank(season, groupType, groupValue, rank)
    let attempts2 = 0
    while (!standing && attempts2 < 50) {
        rank = randomInRange(1, maxRank)
        standing = getStandingByRank(season, groupType, groupValue, rank)
        attempts2++

    }
    console.log(`Generating standings question for season ${season}, groupType ${groupType}, groupValue ${groupValue}, rank ${rank}`)


    return standingsQuestion(season, groupType, groupValue, rank)

}





export { ensuredCache, tierPicker, pickSeasonFromTier, randomContractQuestionGenerator, randomStandingsQuestionGenerator, randomDraftQuestionGenerator, randomStatLeaderQuestionGenerator, randomInRange, getValidStatTypes, statLeaderTiers, standingsTiers, draftTiers }