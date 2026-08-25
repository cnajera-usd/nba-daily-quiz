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

export { getLeaderByRank, getStandingByRank }