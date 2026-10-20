import { supabase } from './supabaseClient.js'



export async function quizExistsForDate(date) {
    const query = supabase.from('daily_quizzes').select('date').eq('date', date)
    const { data, error } = await query
    if (error) {
        throw error
    }

    return data.length > 0


}

export async function saveQuizToSupabase(quiz, date) {

    const pendingQuiz = quiz.map(q => ({...q, status: 'pending' }))
    const { data, error } = await supabase.from('questions').insert(pendingQuiz).select()
    if (error) {
        throw error
    } 

    
    const result = data.map((question, index) => ({

    question_id: question.id,
    position: index + 1,
    date: date
    })
    )

    const { error: insertError } = await supabase.from('daily_quizzes').insert(result)
    if (insertError) {
        throw insertError
    }
    


}


export async function getRecentQuestions() {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    const cutoffString = cutoff.toISOString().split('T')[0] // Format as YYYY-MM-DD


    const query  = supabase.from('daily_quizzes').select('date, questions(question)').gte('date', cutoffString)
    const { data, error } = await query
    if (error) {
        throw error
    }
    const recentQuestions = data.map(entry => entry.questions.question)

    return recentQuestions



}

export function getTomorrowPacific() {

    const todayString = new Date().toLocaleDateString('en-CA', {timeZone: 'America/Los_Angeles'} )
    const date = new Date(todayString + 'T12:00:00Z')
    date.setUTCDate(date.getUTCDate() + 1) 
    const correctDateString = date.toISOString().split('T')[0]

    return correctDateString


}