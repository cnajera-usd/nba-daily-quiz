import fs from 'fs'


function getLeaderByRank(season, stat_type, rank) {
    const raw = fs.readFileSync(`scripts/dataGenerator/cache/leaders_${season}_${stat_type}.json`)
    const data = JSON.parse(raw)
    const leader = data.find(entry => entry.rank === rank)
    return leader

}

export { getLeaderByRank}