const quizModel = require("../models/quizModel");
const progressModel = require("../models/progressModel");

const getQuizByLessonId = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const quiz = await quizModel.findByLessonId(lessonId);

    if (!quiz) {
      return res.status(404).json({
        status: "fail",
        message: "Kviz za ovu lekciju ne postoji.",
      });
    }

    const formattedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      options: JSON.parse(q.options),
    }));

    const responseQuiz = {
      id: quiz.id,
      lesson_id: quiz.lesson_id,
      title: quiz.title,
      questions: formattedQuestions,
    };

    res.status(200).json({ status: "success", data: responseQuiz });
  } catch (error) {
    console.error("Greška pri dohvaćanju kviza:", error);
    res.status(500).json({
      status: "error",
      message: "Greška na serveru.",
    });
  }
};

const submitQuiz = async (req, res) => {
  const { quiz_id, answers } = req.body;
  const userId = req.user.id;

  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ error: "Nije poslan nijedan odgovor." });
  }

  try {
    console.log("➡️ submitQuiz START");
    console.log("quiz_id:", quiz_id);
    console.log("answers:", answers);
    const questionIds = Object.keys(answers);
    const correctAnswers = await quizModel.getCorrectAnswers(questionIds);

    const correctAnswersMap = new Map(
      correctAnswers.map((a) => [a.id, a.correct_option_index])
    );

    let score = 0;
    const results = {};

    for (const questionId of questionIds) {
      const userIndex = answers[questionId];
      const correctIndex = correctAnswersMap.get(parseInt(questionId));
      const isCorrect = userIndex === correctIndex;

      if (isCorrect) score++;
      results[questionId] = {
        isCorrect,
        userAnswer: userIndex,
        correctAnswer: correctIndex,
      };
    }

    const totalQuestions = correctAnswers.length;
    const isPass = score === totalQuestions && totalQuestions > 0;

    if (isPass) {
      await progressModel.saveQuizProgress({ userId, quizId: quiz_id });

      const quiz = await quizModel.getLessonIdForQuiz(quiz_id);
      if (quiz && quiz.lesson_id) {
        await progressModel.checkAndUpdateLessonProgress(
          userId,
          quiz.lesson_id
        );
      }
    }
    console.log("✅ submitQuiz END, score:", score, "results:", results);
    res.json({ score, totalQuestions, results });
  } catch (error) {
    console.error("❌ Greška pri obradi kviza:", error);
    console.error(error.stack);
    res.status(500).json({ status: "error", message: "Greška na serveru." });
  }
};

module.exports = {
  getQuizByLessonId,
  submitQuiz,
};
