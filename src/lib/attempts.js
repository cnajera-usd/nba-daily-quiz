import {supabase } from './supabase'
import { ensureSession } from './auth'

export async function saveAttempt (quizDate, score, questions, answers) {
    if (!supabase) return

    await ensureSession()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.error('No user found after ensureSession')
        return
    }

    const attemptAnswers = answers.map((a, i) => ({
        question_id: questions[i].id,
        selected: a.selected,
        correct: a.correct
    }))

    const { error } = await supabase.from('attempts').insert({
        user_id: user.id,
        quiz_date: quizDate,
        score: score,
        answers: attemptAnswers

    })
    if (error && error.code !== '23505') {
        console.error('Failed to save attempt:', error.message)
    }
}
