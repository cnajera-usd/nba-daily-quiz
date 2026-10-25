import { useState, useEffect, useCallback } from 'react'
import { getTodayPacific } from '../utils/pacificDate'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'nba-quiz-state'

export function useQuiz() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])   // array of { selected, correct }
  const [status, setStatus] = useState('idle') // idle | playing | finished
  const [loading, setLoading] = useState(true)

  // Load questions (from Supabase if available, else local)
  useEffect(() => {
    async function loadQuestions() {
      

      if (supabase) {
        const { data, error } = await supabase.from('daily_quizzes').select('position, questions(*)').eq('date', getTodayPacific()).order('position')
        const daily = data.map(row => ({...row.questions, answerIndex: row.questions.answer_index }))
        setQuestions(daily)


      }
      setLoading(false)

    
    }

    // Restore saved state for today if it exists
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.dateKey === getTodayPacific()) {
          setQuestions(parsed.questions)
          setCurrentIndex(parsed.currentIndex)
          setAnswers(parsed.answers)
          setStatus(parsed.status)
          setLoading(false)
          return
        }
      } catch (error) {
        console.error('Restore failed', error)
      }
    }

    loadQuestions()
  }, [])

  // Persist state to localStorage on every change
  useEffect(() => {
    if (!loading && questions.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        dateKey: getTodayPacific(),
        questions,
        currentIndex,
        answers,
        status,
      }))
    }
  }, [questions, currentIndex, answers, status, loading])

  const startQuiz = useCallback(() => setStatus('playing'), [])

  const submitAnswer = useCallback((selectedIndex) => {
    const q = questions[currentIndex]
    const correct = selectedIndex === q.answerIndex
    const newAnswers = [...answers, { selected: selectedIndex, correct }]
    setAnswers(newAnswers)
  }, [questions, currentIndex, answers])

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setStatus('finished')
    } else {
      setCurrentIndex(i => i + 1)
    }
  }, [currentIndex, questions.length])

  const score = answers.filter(a => a.correct).length
  const currentQuestion = questions[currentIndex] ?? null
  const hasAnswered = answers.length > currentIndex

  return {
    questions,
    currentQuestion,
    currentIndex,
    answers,
    status,
    loading,
    score,
    hasAnswered,
    startQuiz,
    submitAnswer,
    nextQuestion,
  }
}
