import { generateDailyQuiz } from "./dailyQuizGenerator.js";
import { saveQuizToSupabase, getRecentQuestions, getTomorrowPacific } from "./saveQuiz.js";


async function runDailyQuiz() {
    
    try {
        const dateTomorrow = getTomorrowPacific()
        const recentQuestions = await getRecentQuestions()
        const createNewQuiz = await generateDailyQuiz(recentQuestions)
        await saveQuizToSupabase(createNewQuiz, dateTomorrow)
        console.log('Saved quiz for', dateTomorrow)
    } catch (error) {
        console.error("Error: ran into problem", error)
        process.exit(1)
    }



}

await runDailyQuiz()
