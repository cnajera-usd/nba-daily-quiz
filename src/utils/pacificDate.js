
export function getTodayPacific() {
    const date = new Date().toLocaleDateString('en-CA', {timeZone: 'America/Los_Angeles'} )
    return date


}

export function getYesterdayPacific() {
    const todayString = new Date().toLocaleDateString('en-CA', {timeZone: 'America/Los_Angeles'} )
    const date = new Date(todayString + 'T12:00:00Z')
    date.setUTCDate(date.getUTCDate() - 1) 
    const correctDateString = date.toISOString().split('T')[0]

    return correctDateString
}