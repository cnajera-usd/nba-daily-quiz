import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getTodayPacific } from '../utils/pacificDate'
import styles from './Admin.module.css'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(null)

  // Track login state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const loadQuizzes = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('daily_quizzes')
      .select('date, position, questions(*)')
      .gte('date', getTodayPacific())
      .order('date')
      .order('position')
    if (error) {
      setError(error.message)
    } else {
      setRows(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) loadQuizzes()
  }, [session, loadQuizzes])

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError(error.message)
  }

  // Apply changed fields to the matching question in local state
  function patchLocal(ids, changes) {
    setRows(prev =>
      prev.map(row =>
        row.questions && ids.includes(row.questions.id)
          ? { ...row, questions: { ...row.questions, ...changes } }
          : row
      )
    )
  }

  async function setStatus(ids, status) {
    const { error } = await supabase.from('questions').update({ status }).in('id', ids)
    if (error) {
      setError(error.message)
      return
    }
    setError('')
    patchLocal(ids, { status })
  }

  function startEdit(q) {
    setEditingId(q.id)
    setDraft({
      category: q.category ?? '',
      question: q.question ?? '',
      options: [...q.options],
      details: q.options.map((_, i) => q.options_details?.[i] ?? ''),
      answer_index: q.answer_index,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(null)
  }

  function updateDraftOption(i, value) {
    setDraft(d => ({ ...d, options: d.options.map((o, idx) => (idx === i ? value : o)) }))
  }

  function updateDraftDetail(i, value) {
    setDraft(d => ({ ...d, details: d.details.map((o, idx) => (idx === i ? value : o)) }))
  }

  async function saveEdit() {
    if (!draft.question.trim() || draft.options.some(o => !o.trim())) {
      setError('Question and all options need text.')
      return
    }
    const changes = {
      category: draft.category.trim(),
      question: draft.question.trim(),
      options: draft.options.map(o => o.trim()),
      options_details: draft.details.map(d => d.trim()),
      answer_index: draft.answer_index,
      status: 'approved',
    }
    const { error } = await supabase.from('questions').update(changes).eq('id', editingId)
    if (error) {
      setError(error.message)
      return
    }
    setError('')
    patchLocal([editingId], changes)
    cancelEdit()
  }

  if (checking) return <div className={styles.page}>Loading...</div>

  if (!session) {
    return (
      <div className={styles.page}>
        <form className={styles.login} onSubmit={handleLogin}>
          <h1 className={styles.title}>Admin login</h1>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {loginError && <p className={styles.error}>{loginError}</p>}
          <button className={styles.primary} type="submit">Log in</button>
        </form>
      </div>
    )
  }

  // Group rows by date
  const byDate = {}
  for (const row of rows) {
    if (!byDate[row.date]) byDate[row.date] = []
    byDate[row.date].push(row)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Review questions</h1>
        <button className={styles.ghost} onClick={() => supabase.auth.signOut()}>
          Log out
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.muted}>Loading...</p>}
      {!loading && rows.length === 0 && (
        <p className={styles.muted}>No upcoming quizzes found.</p>
      )}

      {Object.entries(byDate).map(([date, items]) => {
        const questions = items.map(r => r.questions).filter(Boolean)
        const pendingIds = questions.filter(q => q.status === 'pending').map(q => q.id)
        const approvedCount = questions.filter(q => q.status === 'approved').length

        return (
          <section key={date} className={styles.day}>
            <div className={styles.dayHeader}>
              <div>
                <h2 className={styles.date}>{date}</h2>
                <p className={styles.muted}>
                  {approvedCount}/{questions.length} approved
                </p>
              </div>
              <button
                className={styles.primary}
                disabled={pendingIds.length === 0}
                onClick={() => setStatus(pendingIds, 'approved')}
              >
                Approve all pending ({pendingIds.length})
              </button>
            </div>

            {questions.map((q, i) => (
              <div key={q.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.category}>
                    {i + 1}. {q.category}
                  </span>
                  <span className={`${styles.badge} ${styles[q.status]}`}>{q.status}</span>
                </div>

                {editingId === q.id && draft ? (
                  <div className={styles.editForm}>
                    <label className={styles.label}>Category</label>
                    <input
                      className={styles.input}
                      value={draft.category}
                      onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
                    />

                    <label className={styles.label}>Question</label>
                    <input
                      className={styles.input}
                      value={draft.question}
                      onChange={e => setDraft(d => ({ ...d, question: e.target.value }))}
                    />

                    {draft.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`${styles.editOption} ${draft.answer_index === idx ? styles.editCorrect : ''}`}
                        >
                        <label className={styles.radio}>
                          <input
                            type="radio"
                            name={`answer-${q.id}`}
                            checked={draft.answer_index === idx}
                            onChange={() => setDraft(d => ({ ...d, answer_index: idx }))}
                          />
                          {['A', 'B', 'C', 'D'][idx]} {draft.answer_index === idx ? '— correct answer' : '— mark as correct'}
                        </label>
                        <input
                          className={styles.input}
                          value={opt}
                          onChange={e => updateDraftOption(idx, e.target.value)}
                          placeholder="Option"
                        />
                        <input
                          className={styles.input}
                          value={draft.details[idx]}
                          onChange={e => updateDraftDetail(idx, e.target.value)}
                          placeholder="Detail (shown after answering)"
                        />
                      </div>
                    ))}

                    <div className={styles.actions}>
                      <button className={styles.primary} onClick={saveEdit}>
                        Save &amp; Approve
                      </button>
                      <button className={styles.ghost} onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.question}>{q.question}</p>
                    <ul className={styles.options}>
                      {q.options.map((opt, idx) => (
                        <li
                          key={idx}
                          className={idx === q.answer_index ? styles.correct : styles.option}
                        >
                          {opt}
                          {q.options_details?.[idx] && (
                            <span className={styles.detail}> — {q.options_details[idx]}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.actions}>
                      <button
                        className={styles.primary}
                        disabled={q.status === 'approved'}
                        onClick={() => setStatus([q.id], 'approved')}
                      >
                        Approve
                      </button>
                      <button className={styles.ghost} onClick={() => startEdit(q)}>
                        Edit
                      </button>
                      <button
                        className={styles.danger}
                        disabled={q.status === 'rejected'}
                        onClick={() => setStatus([q.id], 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}