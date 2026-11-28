import { supabase } from './supabase'
import { getTodayPacific } from '../utils/pacificDate'

export async function fetchTodaysQuestions() {
    if (!supabase) return []

    const today = getTodayPacific()
    const { data, error } = await supabase.from('daily_quizzes').select('position, questions(*)').eq('date', today).order('position')
    if (error) {
        console.error("Failed to fetch today's questions:", error.message)
        return []
    }
    if (data.length === 0 || data.some(row => !row.questions)) {
        console.error("No questions found for today's quiz")
        return []
    }
    return data.map(row => ({ ...row.questions, answerIndex: row.questions.answer_index }))
}