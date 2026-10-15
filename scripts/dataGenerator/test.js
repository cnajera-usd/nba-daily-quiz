import { standingsQuestion, statLeaderQuestion, draftQuestionGenerator, contractQuestionGenerator } from "./templates/questionGenerators.js";
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "./processor.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages, fetchAllTeams } from './fetcher.js'
import { supabase } from './supabaseClient.js'
import { ensuredCache, tierPicker, pickSeasonFromTier, standingsTiers, randomContractQuestionGenerator, randomInRange,randomStandingsQuestionGenerator, randomDraftQuestionGenerator, randomStatLeaderQuestionGenerator, statLeaderTiers, generateDailyQuiz, generateUniqueQuestion } from './dailyQuizGenerator.js'
console.log('KEY LOADED:', process.env.BALLDONTLIE_API_KEY ? `yes, length ${process.env.BALLDONTLIE_API_KEY.length}` : 'NO — undefined')


// Test the randomContractQuestionGenerator function
// console.log(await randomContractQuestionGenerator())


// Test the randomDraftQuestionGenerator function
// console.log(await randomDraftQuestionGenerator())

// Test the randomStatLeaderQuestionGenerator function
// console.log(await randomStatLeaderQuestionGenerator())

// Test the randomStandingsQuestionGenerator function
/*for (let i = 0; i < 50; i++) {
    try {
        const result = await randomStandingsQuestionGenerator()
        console.log(`Run ${i + 1}: ${result.question}`)
        console.log(result.options[result.answer_index])
    } catch (error) {
        console.log(`Run ${i + 1} FAILED: ${error.message}`)
    }
    
}
*/

// Testing the generateDailyQuiz function
/*
const quiz = await generateDailyQuiz()
console.log(quiz.length)
const uniqueQuestions = quiz.map(q => q.question)
const uniqueCount = new Set(uniqueQuestions).size
console.log(`Unique questions: ${uniqueCount} out of ${quiz.length}`)
*/

// Test the generateUniqueQuestion function
/*const throwingGenerator = () => {
    throw new Error('fake generator failure')
}

try {
    console.log(await generateUniqueQuestion(throwingGenerator, []))
} catch (error) {
    console.log('Final error:', error.message)
}
*/

/*
console.log(await supabase.from('questions').select('*').limit(1))
const questions = await supabase.from('questions').select('*')
*/

/*
const quiz = await generateDailyQuiz()
const pendingQuiz = quiz.map(q => ({...q, status: 'pending' }))
console.log(pendingQuiz)
const { data, error } = await supabase.from('questions').insert(pendingQuiz).select()
console.log(data, error)
*/

const { data, error } = await supabase.from('questions').select()
const result = data.map((question, index) => ({

  question_id: question.id,
  position: index + 1,
  date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
  })
)
console.log(result)

const { error: insertError } = await supabase.from('daily_quizzes').insert(result)
console.log('Insert error:', insertError)