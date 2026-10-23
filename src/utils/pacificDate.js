
export function getTodayPacific() {
    const date = new Date().toLocaleDateString('en-CA', {timeZone: 'America/Los_Angeles'} )
    return date


}
