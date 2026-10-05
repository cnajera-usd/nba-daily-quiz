import fs from 'fs'


function getLeaderByRank(season, stat_type, rank) {
    const path = `scripts/dataGenerator/cache/leaders_${season}_${stat_type}.json`

    if (!fs.existsSync(path)) {
        throw new Error(`No caches leaders for stat_type ${stat_type},  in season ${season}`)
    }

    const raw = fs.readFileSync(path)
    const data = JSON.parse(raw)
    const leader = data.find(entry => entry.rank === rank)
    return leader

}


function getStandingByRank(season, groupType, groupValue, rank) {
    const path = `scripts/dataGenerator/cache/standings_${season}.json`

    if (!fs.existsSync(path)) {
        throw new Error(`No caches standings for season ${season}`)
    }

    const raw = fs.readFileSync(path)
    const data = JSON.parse(raw)

    const standing = data.find(entry => 
        entry.season === season &&
        entry.team[groupType] === groupValue &&
        entry[`${groupType}_rank`] === rank
    )

    return standing
}



function getPlayerByDraftPick(year, pick) {
    const path = `scripts/dataGenerator/cache/players.json`

    if (!fs.existsSync(path)) {
        throw new Error("No player cache found. Run fetchAllPlayers() first.")
    }

    const raw = fs.readFileSync(path)
    const data = JSON.parse(raw)

    const player = data.find(entry =>
        entry.draft_number === pick &&
        entry.draft_year === year
    )

    return player
}


function getTopContractsByTeam(team_id, season) {
    const path = `scripts/dataGenerator/cache/contracts_${team_id}_${season}.json`

    if (!fs.existsSync(path)) {
        throw new Error("No contracts cache found. Run fetchTeamContracts() first.")
    }

    const raw = fs.readFileSync(path)
    const data = JSON.parse(raw)

    data.sort((a, b) => b.cap_hit - a.cap_hit)
    const topContracts = data.slice(0, 6)


    return topContracts
}

function getMaxRankForGroup(season, groupType, groupValue) {
    const path = `scripts/dataGenerator/cache/standings_${season}.json`

    if (!fs.existsSync(path)) {
        throw new Error(`No caches standings for season ${season}`)
    }

    const raw = fs.readFileSync(path)
    const data = JSON.parse(raw)

    const filteredData = data.filter(entry => entry.season === season && entry.team[groupType] === groupValue)

    return filteredData.length

}

export { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam, getMaxRankForGroup }