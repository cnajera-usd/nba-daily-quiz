import { getLeaderByRank } from "../processor.js";

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5)
}

function ppgLeaderQuestion(season) {
    const answer = getLeaderByRank(season, 'pts', 1)
    const incorrectAnswers = [
        getLeaderByRank(season, 'pts', 2),
        getLeaderByRank(season, 'pts', 3),
        getLeaderByRank(season, 'pts', 4)
    ]
   const question = "Who led the NBA in points per game in the " + season + " season?"
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

export { ppgLeaderQuestion }