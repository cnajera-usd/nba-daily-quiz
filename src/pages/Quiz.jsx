import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '@/hooks/useQuiz'
import styles from './Quiz.module.css'

const LETTERS = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const navigate = useNavigate()
  const {
    currentQuestion,
    currentIndex,
    answers,
    status,
    loading,
    hasAnswered,
    startQuiz,
    submitAnswer,
    nextQuestion,
  } = useQuiz()

  // Auto-start and handle navigation
  useEffect(() => {
    if (status === 'idle') startQuiz()
    if (status === 'finished') navigate('/results')
  }, [status, startQuiz, navigate])

  if (loading || !currentQuestion) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDot} />
        <div className={styles.loadingDot} />
        <div className={styles.loadingDot} />
      </div>
    )
  }

  const currentAnswer = answers[currentIndex]
  const progressPct = ((currentIndex + (hasAnswered ? 1 : 0)) / 10) * 100

  function getOptClass(i) {
    if (!hasAnswered) return ''
    if (i === currentQuestion.answerIndex) return styles.correct
    if (i === currentAnswer?.selected) return styles.wrong
    return styles.dimmed
  }

  return (
    <div className={styles.shell}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          NBA <span className={styles.accent}>Quiz</span>
        </div>
        <div className={styles.counter}>
          {currentIndex + 1} <span className={styles.counterOf}>/ 10</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      {/* Question */}
      <div className={styles.body}>
        <div className={styles.category}>{currentQuestion.category}</div>
        <p className={styles.question}>{currentQuestion.question}</p>

        <div className={styles.options}>
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              className={`${styles.option} ${getOptClass(i)}`}
              onClick={() => !hasAnswered && submitAnswer(i)}
              disabled={hasAnswered}
            >
              <span className={styles.optLetter}>{LETTERS[i]}</span>
              <span className={styles.optText}>{opt}</span>
              {hasAnswered && i === currentQuestion.answerIndex && (
                <span className={styles.checkmark}>✓</span>
              )}
              {hasAnswered && i === currentAnswer?.selected && i !== currentQuestion.answerIndex && (
                <span className={styles.xmark}>✗</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        {hasAnswered && (
          <div className={styles.feedback}>
            {currentAnswer?.correct ? (
              <span className={styles.feedbackCorrect}>Correct! 🎯</span>
            ) : (
              <span className={styles.feedbackWrong}>
                The answer was <strong>{currentQuestion.options[currentQuestion.answerIndex]}</strong>
              </span>
            )}
          </div>
        )}
        <button
          className={`${styles.nextBtn} ${hasAnswered ? styles.nextActive : ''}`}
          onClick={nextQuestion}
          disabled={!hasAnswered}
        >
          {currentIndex === 9 ? 'See Results →' : 'Next Question →'}
        </button>
      </div>
    </div>
  )
}
