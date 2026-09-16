import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "../processor.js";

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function finalizeAnswers(indexedAnswers) {
    const shuffledAnswers = shuffle(indexedAnswers)
    const options = shuffledAnswers.map(answer => answer.name)
    const answerIndex = shuffledAnswers.findIndex(answer => answer.isCorrect)
    
    return { options, answerIndex }
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

    const shuffledAnswers = finalizeAnswers(indexedAnswers)


   return {
    category: 'Stats',
    question: question,
    options: shuffledAnswers.options,
    answer_index: shuffledAnswers.answerIndex,
    author: 'coder',
    status: 'approved'

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

    const shuffledAnswers = finalizeAnswers(indexedAnswers)


    return {
        category: 'Standings',
        question: question,
        options: shuffledAnswers.options,
        answer_index: shuffledAnswers.answerIndex,
        author: 'coder',
        status: 'approved'
    }
}


function draftQuestionGenerator(year, pick) {
    const question = `Who was the ${ordinalSuffix(pick)} pick in the ${year} NBA Draft?`

    const picks = Array.from({ length: 60 }, (value, index) => index + 1)
    const otherPicks = picks.filter((p) => p !== pick)
    const shuffledPicks = shuffle(otherPicks)
    const distractors = shuffledPicks.slice(0, 3)
    const finalPicks = [pick, ...distractors]

    const players = finalPicks.map(pick => getPlayerByDraftPick(year, pick))
    const indexedAnswers = players.map((player, index) => {
        return {
            name: `${player.first_name} ${player.last_name}`,
            isCorrect: index === 0
        }
    })

    const shuffledAnswers = finalizeAnswers(indexedAnswers)

    return {

        category: 'Draft',
        question: question,
        options: shuffledAnswers.options,
        answer_index: shuffledAnswers.answerIndex,
        author: 'coder',
        status: 'approved'
    }
}

function contractQuestionGenerator(team_id, season) {
    const topContracts = getTopContractsByTeam(team_id, season)
    const shuffledContracts = shuffle(topContracts)
    const correctContract = shuffledContracts[0]
    const distractorContracts = shuffledContracts.slice(1, 4)
    const finalContracts = [correctContract, ...distractorContracts]

    const indexedAnswers = finalContracts.map((contract, index) => {
        return {
            name: `${contract.player.first_name} ${contract.player.last_name}`,
            isCorrect: index === 0
        }
    })

    const question = `Which player made $${correctContract.cap_hit.toLocaleString()} in the ${season} season for the ${correctContract.team.full_name}?`
    const shuffledAnswers = finalizeAnswers(indexedAnswers)
    
    return {
        category: 'Contracts',
        question: question,
        options: shuffledAnswers.options,
        answer_index: shuffledAnswers.answerIndex,
        status: 'approved',
        author: 'coder'

    }
}

    



export { statLeaderQuestion, standingsQuestion, draftQuestionGenerator, contractQuestionGenerator }