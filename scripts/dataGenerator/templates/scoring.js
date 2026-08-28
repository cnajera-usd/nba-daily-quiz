import { getLeaderByRank, getStandingByRank } from "../processor.js";

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}


function ordinalSuffix(number) {
    const lastTwoDigit = number % 100
    const lastDigit = number % 10
    
    if (lastTwoDigit >= 11 && lastTwoDigit <= 13) {
        return `${number}th`
    }

    if (lastDigit === 1) {
        return `${number}st`
    }

    if (lastDigit === 2) {
        return `${number}nd`
    }
    
    if (lastDigit === 3) {
        return `${number}rd`
    }

    return `${number}th`
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


function standingsQuestion(season, groupType, groupValue, rank) {
    const question = `Which team finished ${ordinalSuffix(rank)} in the ${groupType} ${groupValue} in the ${season} season?`

    let maxRank
    if (groupType ===  'conference') {
        maxRank = 15
    } else {
        maxRank = 5
    }
    const allRanks = Array.from({ length: maxRank }, (value, index) => index+1)
    const filteredRanks = allRanks.filter((r) => r !== rank)
    const shuffledRanks = shuffle(filteredRanks)
    const distractors = shuffledRanks.slice(0, 3)
    const finalRanks = [rank, ...distractors]

    const standings = finalRanks.map(rank => getStandingByRank(season, groupType, groupValue, rank))
    const indexedAnswers = standings.map((standing, index) => {
    return {
        name: `${standing.team.full_name}`,
        isCorrect: index === 0
        }
    })

    const shuffledAnswers = shuffle(indexedAnswers)
    const options = shuffledAnswers.map(answer => answer.name)
    const answerIndex = shuffledAnswers.findIndex(answer => answer.isCorrect)


    return {
        category: 'Standings',
        question: question,
        options: options,
        answer_index: answerIndex,
        author: 'ai',
        status: 'pending'
    }
}


export { statLeaderQuestion, standingsQuestion }