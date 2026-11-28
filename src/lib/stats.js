import { getTodayPacific, getYesterdayPacific } from '../utils/pacificDate.js'

export function computeStats(attempts) {

    if (attempts.length === 0) {
        return { streak: 0, bestStreak: 0, totalPlayed: 0, averageScore: '0.0' }
        }

    const totalPlayed = attempts.length
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const averageScore = totalPlayed > 0 ? (totalScore / totalPlayed).toFixed(1) : '0.0'


    let runningStreak = 1
    let bestStreak = 1
    for (let i = 1; i < attempts.length; i++) {
        
        const prevDate = new Date(attempts[i -1].quiz_date)
        const currentDate = new Date(attempts[i].quiz_date)
        const gapInDays = (currentDate - prevDate) / 86400000

        if (gapInDays === 1) {
            runningStreak++
            bestStreak = Math.max(bestStreak, runningStreak)
        } else {
            runningStreak = 1
        }
    }

    const lastAttemptDate = attempts[attempts.length -1].quiz_date
    const playedRecently = lastAttemptDate === getTodayPacific() || lastAttemptDate === getYesterdayPacific()

    const currentStreak = playedRecently ? runningStreak : 0
    

    return { streak: currentStreak, bestStreak, totalPlayed, averageScore }
    
}