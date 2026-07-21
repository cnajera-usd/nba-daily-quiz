import { getLeaderByRank } from "../processor.js";

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5)
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
    const answer = getLeaderByRank(season, stat_type, 1)
    const incorrectAnswers = [
        getLeaderByRank(season, stat_type, 2),
        getLeaderByRank(season, stat_type, 3),
        getLeaderByRank(season, stat_type, 4)
    ]
   const question = `Who led the NBA in ${statNames[stat_type]} in the ${season} season?`
   const correctAnswer = `${answer.player.first_name} ${answer.player.last_name}`
   const wrongAnswers = incorrectAnswers.map(p => `${p.player.first_name} ${p.player.last_name}`)


    const allAnswers = [correctAnswer, ...wrongAnswers]
    const shuffledAnswers = shuffle(allAnswers)
    const answerIndex = shuffledAnswers.indexOf(correctAnswer)


   return {
    category: 'Stats',
    question: question,
    options: shuffledAnswers,
    answer_index: answerIndex,
    author: 'ai',
    status: 'pending'

   }

}

export { statLeaderQuestion }