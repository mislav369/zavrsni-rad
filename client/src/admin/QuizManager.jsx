import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

function QuizManager() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ id: null, title: "", questions: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/quiz`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Greška pri dohvaćanju kviza.");
      const data = await response.json();
      const formattedQuiz = {
        ...data,
        questions: data.questions.map((q) => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : [],
        })),
      };
      setQuiz(formattedQuiz);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleQuizTitleChange = (e) => {
    setQuiz({ ...quiz, title: e.target.value });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = quiz.questions.map((q, index) => {
      if (index === qIndex) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestion = () => {
    const newQuestion = {
      question_text: "",
      options: ["", "", "", ""],
      correct_option_index: 0,
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const removeQuestion = (qIndex) => {
    const newQuestions = quiz.questions.filter((_, index) => index !== qIndex);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quiz.questions.length === 0) {
      toast.error("Kviz mora imati barem jedno pitanje.");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = { ...quiz, lesson_id: parseInt(lessonId), quizId: quiz.id };

    try {
      const response = await fetch(
        quiz.id ? `/api/admin/quiz/${quiz.id}` : "/api/admin/quiz",
        {
          method: quiz.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Greška pri spremanju kviza.");

      toast.success("Kviz uspješno spremljen!");
      navigate("/admin/lessons");
      fetchQuiz();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!quiz.id) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/admin/quiz/${quiz.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Greška pri brisanju kviza.");
      toast.success("Kviz uspješno obrisan.");
      navigate("/admin/lessons");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="text-white bg-gray-800 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        Upravljanje kvizom za lekciju ID: {lessonId}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Naslov Kviza
          </label>
          <input
            name="title"
            value={quiz.title}
            onChange={handleQuizTitleChange}
            className="bg-gray-700 p-2 rounded w-full md:w-1/2"
            required
          />
        </div>

        {quiz.questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="bg-gray-900 p-4 rounded-lg mb-4 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold">Pitanje {qIndex + 1}</h4>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 hover:text-red-400 text-sm cursor-pointer"
              >
                Ukloni Pitanje
              </button>
            </div>
            <textarea
              value={q.question_text}
              onChange={(e) =>
                handleQuestionChange(qIndex, "question_text", e.target.value)
              }
              placeholder="Tekst pitanja"
              className="w-full bg-gray-700 p-2 rounded"
              rows="3"
              required
            ></textarea>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct_option_${qIndex}`}
                    checked={q.correct_option_index === oIndex}
                    onChange={() =>
                      handleQuestionChange(
                        qIndex,
                        "correct_option_index",
                        oIndex
                      )
                    }
                    className="form-radio h-5 w-5 text-sky-500 bg-gray-700 border-gray-600 focus:ring-sky-600"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    placeholder={`Odgovor ${oIndex + 1}`}
                    required
                    className="flex-1 bg-gray-700 p-2 rounded border border-gray-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Dodaj pitanje
        </button>
        <div className="mt-8 flex justify-between items-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            {quiz.id ? "Ažuriraj kviz" : "Spremi kviz"}
          </button>
          {quiz.id && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Obriši kviz
            </button>
          )}
        </div>
      </form>

      <Link
        to="/admin/lessons"
        className="inline-block mt-8 text-sky-400 hover:text-sky-300"
      >
        &larr; Natrag na upravljanje lekcijama
      </Link>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Potvrda brisanja kviza"
      >
        Jeste li sigurni da želite obrisati ovaj kviz i sva njegova pitanja? Ova
        akcija je nepovratna.
      </ConfirmModal>
    </div>
  );
}

export default QuizManager;
