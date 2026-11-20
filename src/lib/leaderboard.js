import { supabase } from './supabase'

export async function fetchLeaderboard() {

    if (!supabase) return []

    const { data, error } = await supabase.rpc('get_average_leaderboard')
    if (error) {
        console.error('Failed to fetch leaderboard:', error.message)
        return []
    } else {
        return data
    }
}


