import 'dotenv/config'
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateQuestions() {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {role: "system", content: "You are a helpful assistant that generates NBA trivia questions."},
            {role: "user", content: `
                You are an NBA trivia question generator. Generate 104 NBA trivia multiple choice questions. Return ONLY a raw JSON array, no explanation, no markdown, no backticks, no preamble. Just the array.
                    Each object must follow this exact format:
                    {
                        "category": "Coaches",
                        "question": "Which coach did Kobe Bryant play under for the most seasons?",
                        "options": ["Del Harris", "Phil Jackson", "Mike Brown", "Byron Scott"],
                        "answer_index": 1,
                        "author": "ai"
                    }

                    Generate EXACTLY this many questions per category, no more no less:
                    - Players: 8
                    - Teams: 8
                    - Championships: 8
                    - Records: 8
                    - History: 8
                    - Trades: 8
                    - Free Agency: 8
                    - Contracts: 8
                    - Coaches: 8
                    - Specific Games: 8
                    - Rivalries: 8
                    - Draft: 8
                    - Ages & Milestones: 8

                    Era coverage — spread questions across 1960s through 2020s, no era should dominate.

                    Difficulty split:
                    Difficulty split:
                    Hard (100%) — deep cuts, hardcore fans only. Every single question should be something 
                    that only a真 die-hard NBA fan would know. Think obscure stats, specific game moments, 
                    exact contract values, trade details, draft positions, coaching records, and historical 
                    facts that casual fans would have no idea about.
                    
                    Rules:
                    Wrong answer options must be plausible — never obvious throwaway answers
                    Easy questions should still have plausible wrong answers, not joke options
                    Never ask about current season stats or live standings that change week to week. 
                    Historical records and all-time stats are fine even if theoretically breakable someday.
                    answer_index must always be 100% factually correct — double check every single answer before outputting
                    No duplicate questions
                    No trick questions
                    options array always has exactly 4 strings
                    answer_index is always 0, 1, 2, or 3
                    Spread questions across many different players, teams and eras — don't over-index on LeBron, Jordan and Kobe
                    Include international players — Dirk, Hakeem, Giannis, Yao Ming, Tony Parker etc.
                    Each question must be meaningfully different from the others — no similar questions
            `}
        ],
    })


    const text = completion.choices[0].message.content
    const questions = JSON.parse(text)

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY)

    const { data: existing } = await supabase.from('questions').select('question')
    const existingTexts = existing.map(q => q.question)

    const newQuestions = questions.filter(q => !existingTexts.includes(q.question))
    const duplicates = questions.length - newQuestions.length

    const questionsWithStatus = newQuestions.map(q => ({ ...q, status: 'pending' }))

    if (newQuestions.length > 0) {
        await supabase.from('questions').insert(questionsWithStatus)
    }

    
    console.log(` Generated: ${questions.length}`)
    console.log(` Inserted: ${newQuestions.length}`)
    console.log(` Skipped (duplicates): ${duplicates}`)
}

generateQuestions()