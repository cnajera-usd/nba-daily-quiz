import { getTodayPacific } from "./pacificDate"


const LAUNCH_DATE = '2026-10-31'


export function getQuizNumber() {
  const todayDate = new Date(getTodayPacific() + 'T12:00:00Z')
  const launchDate = new Date(LAUNCH_DATE + 'T12:00:00Z')

  const diff = Math.floor((todayDate - launchDate) / (1000 * 60 * 60 * 24))
  return diff + 1
}
