import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import { markdownComponents } from "./MarkdownComponents.jsx";

function Quiz() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lessonId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/quiz/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          toast.error("Za ovu lekciju trenutno nema dostupnog kviza.");
          setQuizData(null);
          return;
        }
        const data = await response.json();
        setQuizData(data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((stariOdgovori) => {
      const noviOdgovori = { ...stariOdgovori, [questionId]: optionIndex };
      return noviOdgovori;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const totalQuestions = quizData.questions.length;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions) {
      toast.error("Molimo odgovorite na sva pitanja prije predaje.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quiz_id: quizData.id, answers }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Došlo je do greške.");

      setResults(data);
      window.scrollTo(0, 0); // automatski na vrh (bez smooth)
      toast.success(`Vaš rezultat: ${data.score} / ${data.totalQuestions}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResultOptionClass = (questionId, optionIndex) => {
    const resultForQuestion = results.results[questionId];
    const isCorrectAnswer = resultForQuestion.correctAnswer === optionIndex;
    const isUserChoice = resultForQuestion.userAnswer === optionIndex;

    if (isCorrectAnswer) {
      return "bg-green-600 border-green-400";
    }
    if (isUserChoice && !resultForQuestion.isCorrect) {
      return "bg-red-600 border-red-400";
    }
    return "bg-gray-700 border-transparent";
  };

  if (loading) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl text-white mx-auto">
      <h1 className="text-4xl font-bold mb-4">{quizData.title}</h1>

      {results ? (
        <>
          <div className="mt-8 border-t-2 border-teal-600 pt-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              Rezultati kviza: {results.score}/{results.totalQuestions}
            </h3>
            {quizData.questions.map((q, index) => (
              <div key={q.id} className="mb-6 p-4 bg-gray-900 rounded-lg">
                <div className="flex items-start text-white mb-3">
                  <div className="flex-1 text-lg">
                    <ReactMarkdown
                      components={markdownComponents}
                      rehypePlugins={[rehypePrism]}
                    >
                      {q.question_text}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="space-y-2">
                  {q.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded text-white border-2 text-sm ${getResultOptionClass(
                        q.id,
                        index
                      )}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ height: "56px", marginTop: "1rem" }}></div>
          </div>
        </>
      ) : (
        <>
          <div className="mt-8 border-t-2 border-teal-600 pt-8">
            {quizData.questions.map((q, index) => (
              <div key={q.id} className="mb-6">
                <div className="flex items-start text-white mb-3">
                  <div className="flex-1 text-lg">
                    <ReactMarkdown
                      components={markdownComponents}
                      rehypePlugins={[rehypePrism]}
                    >
                      {q.question_text}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="space-y-2">
                  {q.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(q.id, index)}
                      className={`block w-full text-left p-3 rounded transition-colors border-2 text-md ${
                        answers[q.id] === index
                          ? "bg-sky-600 border-sky-400"
                          : "bg-gray-700 border-gray-600 hover:border-sky-500"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 cursor-pointer"
            >
              {isSubmitting ? "Predajem..." : "Predaj kviz"}
            </button>
          </div>
        </>
      )}

      <div className="mt-8">
        <Link
          to={`/lessons/${lessonId}`}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          &larr; Natrag na lekciju
        </Link>
      </div>
    </div>
  );
}
export default Quiz;
