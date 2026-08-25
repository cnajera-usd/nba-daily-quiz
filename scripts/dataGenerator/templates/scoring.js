import { getLeaderByRank } from "../processor.js";

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const statNames = {
    'pts': 'points per game',
    'reb': 'rebounds per game',
    'ast': 'assists per game',
    'blk': 'blocks per game',
    'stl': 'steals per game',
    'tov': 'turnovers per game'
}

function statLeaderQuestion(season, stat_type) {
   const question = `Who led the NBA in ${statNames[stat_type]} in the ${season} season?`

    const ranks = [1, 2, 3, 4]
    const leaders = ranks.map(rank => getLeaderByRank(season, stat_type, rank))

    const indexedAnswers = leaders.map((leader, index) => {
    return {
        name: `${leader.player.first_name} ${leader.player.last_name}`,
        isCorrect: index === 0
        }
    })

    const shuffledAnswers = shuffle(indexedAnswers)
    const options = shuffledAnswers.map(answer => answer.name)
    const answerIndex = shuffledAnswers.findIndex(answer => answer.isCorrect)


   return {
    category: 'Stats',
    question: question,
    options: options,
    answer_index: answerIndex,
    author: 'ai',
    status: 'pending'

   }

}

export { statLeaderQuestion }