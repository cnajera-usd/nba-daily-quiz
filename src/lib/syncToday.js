import { getTodayPacific } from '@/utils/pacificDate'
import { fetchTodaysQuestions } from './quizzes'
import { fetchTodaysAttempt } from './attempts'

const STORAGE_KEY = 'nba-quiz-state'

function getSavedState() {
  try { return JSON.parse(localStorage.getItem('nba-quiz-state')) } catch { return null }
}

export async function syncTodayFromServer() {
    const today = getTodayPacific()
    const saved = getSavedState()

    if (saved?.dateKey === today && saved?.status === 'finished') return false

    const attempt = await fetchTodaysAttempt()
    if (!attempt) return false

    const questions = await fetchTodaysQuestions()
    if (questions.length === 0) return false

    if (attempt.answers.length !== questions.length) return false


    const answers = attempt.answers.map(a => ({ selected: a.selected, correct: a.correct }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
    dateKey: today,
    questions,
    currentIndex: questions.length - 1,
    answers,
    status: 'finished',
    }))

    return true
}