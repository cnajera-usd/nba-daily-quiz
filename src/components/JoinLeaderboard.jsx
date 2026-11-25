import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProfile } from '@/lib/profiles'
import JoinLeaderboardModal from './JoinLeaderboardModal'
import styles from './JoinLeaderboard.module.css'

export default function JoinLeaderboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(undefined) // undefined = loading, null = no profile yet
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    getMyProfile().then(p => {
      if (!cancelled) setProfile(p)
    })
    return () => { cancelled = true }
  }, [])

  function handleClick() {
    if (profile) navigate('/leaderboard')
    else setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        className={styles.btn}
        onClick={handleClick}
        disabled={profile === undefined}
      >
        {profile === null ? '🏆 Join Leaderboard' : '🏆 Leaderboard'}
      </button>
      {open && (
        <JoinLeaderboardModal
          onClose={() => setOpen(false)}
          onJoined={p => {
            setProfile(p)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}