import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import "prismjs/themes/prism-tomorrow.css";
import { markdownComponents } from "./MarkdownComponents.jsx";

function Lesson() {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [nextLessonId, setNextLessonId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Podaci o lekciji nisu pronađeni.");
        const responseData = await response.json();
        setLessonData(responseData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchNextLesson = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`/api/lessons/${lessonId}/next`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Problem s dohvaćanjem sljedeće lekcije.");

        const nextLessonData = await res.json();

        setNextLessonId(nextLessonData ? nextLessonData.id : null);
      } catch (err) {
        console.error("Greška pri dohvaćanju sljedeće lekcije:", err.message);
      }
    };

    fetchLessonData();
    fetchNextLesson();
  }, [lessonId]);

  const startQuiz = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/quiz/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        toast.error("Za ovu lekciju trenutno nema dostupnog kviza.");
        return;
      }
      navigate(`/lessons/${lessonId}/quiz`);
    } catch (err) {
      toast.error("Došlo je do greške pri dohvaćanju kviza.");
    }
  };

  const startExercise = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/exercises/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        toast.error("Za ovu lekciju trenutno nema dostupnog zadatka.");
        return;
      }
      navigate(`/lessons/${lessonId}/exercise`);
    } catch (err) {
      toast.error("Došlo je do greške pri dohvaćanju zadatka.");
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full text-white mx-auto relative">
      <h1 className="text-4xl font-bold mb-4">{lessonData.title}</h1>

      <div className="mt-8 border-t-2 border-sky-600 pt-4">
        <div className="max-w-none text-lg leading-relaxed">
          <ReactMarkdown
            components={markdownComponents}
            rehypePlugins={[rehypePrism]}
            remarkPlugins={[remarkGfm]}
          >
            {lessonData.content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="mt-10 border-t-2 border-green-500 pt-6">
        <h3 className="text-2xl font-bold mb-2">Praktični zadatak</h3>
        <p className="text-gray-300 mb-4">
          Pokušajte riješiti zadatak vezan uz ovu lekciju.
        </p>
        <button
          onClick={startExercise}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mr-4 cursor-pointer flex items-center space-x-1"
        >
          <span>📝</span>
          <span>Pokreni zadatak</span>
        </button>
      </div>

      <div className="mt-10 border-t-2 border-teal-500 pt-6">
        <h3 className="text-2xl font-bold mb-2">Provjera znanja</h3>
        <p className="text-gray-300 mb-4">
          Provjerite svoje razumijevanje ove lekcije kroz kratki kviz.
        </p>
        <button
          onClick={startQuiz}
          className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded mr-4 cursor-pointer flex items-center space-x-1"
        >
          <span>📋</span>
          <span>Pokreni kviz</span>
        </button>
      </div>

      <div className="mt-8 flex justify-between">
        <Link
          to="/lessons"
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded"
        >
          &larr; Natrag na sve lekcije
        </Link>

        {nextLessonId && (
          <Link
            to={`/lessons/${nextLessonId}`}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded curosr-pointer"
          >
            Sljedeća lekcija &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}

export default Lesson;
