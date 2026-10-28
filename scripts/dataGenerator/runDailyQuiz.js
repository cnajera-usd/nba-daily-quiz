import { generateDailyQuiz } from "./dailyQuizGenerator.js";
import { saveQuizToSupabase, getRecentQuestions, getDatePacific, quizExistsForDate } from "./saveQuiz.js";



async function runDailyQuiz() {
    
        const daysAhead = Number(process.argv[2] ?? 1)

        if (daysAhead < 1 || daysAhead > 14 || !Number.isInteger(daysAhead)) {
            console.error("daysAhead was not a valid input")
            process.exit(1)
        }


        try {
            
        for (let i = 1; i <= daysAhead; i++){

            const date = getDatePacific(i)
            const checkForQuiz = await quizExistsForDate(date)

            if (checkForQuiz) {
            
            console.log("Quiz already exists for", date)
            } else {

                const recentQuestions = await getRecentQuestions()
                const createNewQuiz = await generateDailyQuiz(recentQuestions)
                await saveQuizToSupabase(createNewQuiz, date)
                console.log('Saved quiz for', date)
            }
        }
    } catch (error) {
        console.error("Error: ran into problem", error)
        process.exit(1)
        }

}

await runDailyQuiz()
