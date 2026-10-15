import { supabase } from './supabaseClient.js'


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