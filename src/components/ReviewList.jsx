import { useState } from 'react'
import styles from './ReviewList.module.css'

export default function ReviewList({ questions, answers }) {
  const [filter, setFilter] = useState('all') // 'all' | 'missed'

  if (!questions?.length || !answers?.length) return null

  const items = questions.map((q, i) => ({
    q,
    number: i + 1,
    answer: answers[i],
  }))

  const missedCount = items.filter(item => item.answer && !item.answer.correct).length
  const shown = filter === 'missed' ? items.filter(item => item.answer && !item.answer.correct) : items

  return (
    <section className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Review answers</h2>
        <div className={styles.toggle}>
          <button
            className={filter === 'all' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setFilter('all')}
          >
            All ({items.length})
          </button>
          <button
            className={filter === 'missed' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setFilter('missed')}
          >
            Missed ({missedCount})
          </button>
        </div>
      </div>

      {shown.length === 0 && (
        <p className={styles.empty}>Perfect score. Nothing missed!</p>
      )}

      {shown.map(({ q, number, answer }) => (
        <div key={q.id ?? number} className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.category}>
              {number}. {q.category}
            </span>
            <span className={answer?.correct ? styles.right : styles.wrong}>
              {answer?.correct ? '✓ Correct' : '✗ Missed'}
            </span>
          </div>

          <p className={styles.question}>{q.question}</p>

          <ul className={styles.options}>
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.answerIndex
              const isYourPick = idx === answer?.selected
              let className = styles.option
              if (isCorrect) className = styles.optionCorrect
              else if (isYourPick) className = styles.optionWrong

              return (
                <li key={idx} className={className}>
                  <span className={styles.optionText}>
                    {opt}
                    {q.options_details?.[idx] && (
                      <span className={styles.detail}> — {q.options_details[idx]}</span>
                    )}
                  </span>
                  {isYourPick && <span className={styles.tag}>Your answer</span>}
                  {isCorrect && !isYourPick && <span className={styles.tag}>Correct</span>}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </section>
  )
}
