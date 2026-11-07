import { standingsQuestion, statLeaderQuestion, draftQuestionGenerator, contractQuestionGenerator, assertNoTie, assertNoRecordTie } from "./templates/questionGenerators.js";
import { getLeaderByRank, getStandingByRank, getPlayerByDraftPick, getTopContractsByTeam } from "./processor.js";
import { fetchLeaders, fetchStandings, fetchAllPlayers, fetchTeamContracts, fetchSeasonAverages, fetchAllTeams } from './fetcher.js'
import { supabase } from './supabaseClient.js'
import { saveQuizToSupabase, getRecentQuestions, getDatePacific, quizExistsForDate } from './saveQuiz.js'
import { ensuredCache, tierPicker, pickSeasonFromTier, standingsTiers, randomContractQuestionGenerator, randomInRange,randomStandingsQuestionGenerator, randomDraftQuestionGenerator, randomStatLeaderQuestionGenerator, statLeaderTiers, generateDailyQuiz, generateUniqueQuestion } from './dailyQuizGenerator.js'
console.log('KEY LOADED:', process.env.BALLDONTLIE_API_KEY ? `yes, length ${process.env.BALLDONTLIE_API_KEY.length}` : 'NO — undefined')



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

/*
const { data, error } = await supabase.from('questions').select()
export const result = data.map((question, index) => ({

  question_id: question.id,
  position: index + 1,
  date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
  })
)
console.log(result)

const { error: insertError } = await supabase.from('daily_quizzes').insert(result)
console.log('Insert error:', insertError)
*/


//await saveQuizToSupabase(await generateDailyQuiz(), "2026-01-14")

// running query on daily_quizzes 
/*const cutoff = new Date()
cutoff.setDate(cutoff.getDate() - 30)
const cutoffString = cutoff.toISOString().split('T')[0] // Format as YYYY-MM-DD


const query  = supabase.from('daily_quizzes').select('date, questions(question)').gte('date', cutoffString)
const { data } = await query
const recentQuestions = data.map(entry => entry.questions.question)
console.log(recentQuestions)

*/


/*
const fakeGenerator = () => ({ question: 'Test question' })

// Case 1: the question is in the recent list, so every attempt should be rejected
try {
    await generateUniqueQuestion(fakeGenerator, [], ['Test question'])
    console.log('FAIL: should have thrown')
} catch (error) {
    console.log('PASS: rejected as expected ->', error.message)
}

// Case 2: nothing recent, so the question should come back right away
const result = await generateUniqueQuestion(fakeGenerator, [], [])
console.log('PASS if you see the question:', result)
*/

/*
console.log('start')

for (let i = 0; i < 50; i++) {
    const result = await contractQuestionGenerator(26, 2016)
    const correctDetail = result.options_details[result.answer_index]
    const matches = result.options_details.filter(d => d === correctDetail).length
    if (matches > 1) {
        console.log('DUPLICATE', result)
    }
}

console.log('done')
*/

/*
const fake = v => ({ value: v })

// Should throw: 1.96 and 2.04 both round to "2.0"
try {
    assertNoTie([fake(2.04), fake(1.96), fake(1.5), fake(1.2)], 'stl', 2025)
    console.log('FAIL: expected a throw')
} catch (e) {
    console.log('PASS (threw):', e.message)
}

// Should not throw
try {
    assertNoTie([fake(2.04), fake(1.8), fake(1.5), fake(1.2)], 'stl', 2025)
    console.log('PASS (no throw)')
} catch (e) {
    console.log('FAIL: threw unexpectedly:', e.message)
}

// Should throw: only the LAST distractor ties
try {
    assertNoTie([fake(2.04), fake(1.5), fake(1.2), fake(1.96)], 'stl', 2025)
    console.log('FAIL: expected a throw')
} catch (e) {
    console.log('PASS (threw on last):', e.message)
}

*/



/*
const team = (wins, losses) => ({ wins, losses })

// Should throw: first distractor has the same record
try {
    assertNoRecordTie([team(50, 32), team(50, 32), team(45, 37), team(40, 42)], 'conference', 'East', 2025)
    console.log('FAIL: expected a throw')
} catch (e) {
    console.log('PASS (threw):', e.message)
}

// Should throw: only the LAST distractor ties
try {
    assertNoRecordTie([team(50, 32), team(45, 37), team(40, 42), team(50, 32)], 'conference', 'East', 2025)
    console.log('FAIL: expected a throw')
} catch (e) {
    console.log('PASS (threw on last):', e.message)
}

// Should not throw: same wins but different losses (e.g. different game counts)
try {
    assertNoRecordTie([team(50, 32), team(50, 31), team(45, 37), team(40, 42)], 'conference', 'East', 2025)
    console.log('PASS (no throw, same wins only)')
} catch (e) {
    console.log('FAIL: threw unexpectedly:', e.message)
}

// Should not throw: all different
try {
    assertNoRecordTie([team(50, 32), team(48, 34), team(45, 37), team(40, 42)], 'conference', 'East', 2025)
    console.log('PASS (no throw)')
} catch (e) {
    console.log('FAIL: threw unexpectedly:', e.message)
}
   
*/
