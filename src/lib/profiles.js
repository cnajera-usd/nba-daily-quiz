import { supabase } from './supabase'
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity'



const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

export async function getMyProfile() {
    if (!supabase) return null

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.error('No user found')
        return null
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('profile_id', user.id)
        .maybeSingle()
    if (error) {
        console.error('Failed to fetch profile:', error.message)
        return null
    }
    return data
}


export async function createProfile(username) {
    const cleanName = username.trim()

    if (matcher.hasMatch(cleanName)) {
        return { ok: false, message: 'Username contains inappropriate content' }
    }

    if (!supabase) return { ok: false, message: 'Supabase client not found' }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.error('No user found')
        return { ok: false, message: 'No user found' }
    }

    const { error } = await supabase.from('profiles').insert({
    profile_id: user.id,
    username: cleanName,
    })

    if (!error) { return { ok: true } }
    if (error.code === '23505') {
        return { ok: false, message: 'Username already taken' }
    }
    if (error.code === '23514') {
        return { ok: false, message: 'Username must be 3-25 characters' }
    }
    console.error('Failed to create profile:', error.message)
    return { ok: false, message: 'Failed to create profile' }
}