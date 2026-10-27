import { generateDailyQuiz } from "./dailyQuizGenerator.js";
import { saveQuizToSupabase, getRecentQuestions, getDatePacific, quizExistsForDate } from "./saveQuiz.js";



async function runDailyQuiz() {
    
        try {
            const dateTomorrow = getDatePacific()
            const checkForQuiz = await quizExistsForDate(dateTomorrow)
        if (checkForQuiz) {
            console.log("Quiz already exists for", dateTomorrow)
        } else {

            const recentQuestions = await getRecentQuestions()
            const createNewQuiz = await generateDailyQuiz(recentQuestions)
            await saveQuizToSupabase(createNewQuiz, dateTomorrow)
            console.log('Saved quiz for', dateTomorrow)
        }


    } catch (error) {
        console.error("Error: ran into problem", error)
        process.exit(1)
        }

}

await runDailyQuiz()
