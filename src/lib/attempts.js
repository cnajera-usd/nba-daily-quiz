import {supabase } from './supabase'
import { ensureSession } from './auth'
import { getTodayPacific } from '../utils/pacificDate'

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


export async function fetchMyAttempts() {
    if (!supabase) return []

    const { data, error } = await supabase.from('attempts').select('quiz_date, score').order('quiz_date', { ascending: true })
    if (error) {
        console.error('Failed to fetch attempts:', error.message)
        return []
    }
    return data
}


export async function fetchTodaysAttempt() {
    if (!supabase) return null

    const today = getTodayPacific()
    const { data, error } = await supabase.from('attempts').select('score, answers').eq('quiz_date', today).maybeSingle()
    if (error) {
        console.error("Failed to fetch today's attempt:", error.message)
    }
    return data
}
