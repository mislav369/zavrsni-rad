import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "./MarkdownComponents.jsx";

function Exercise() {
  const { lessonId } = useParams();

  const [exercise, setExercise] = useState(null);

  const [error, setError] = useState(null);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const [isCorrect, setIsCorrect] = useState(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `/api/admin/lessons/${lessonId}/exercise`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Zadatak nije pronađen.");

        const data = await response.json();
        if (!data) throw new Error("Zadatak nije pronađen.");

        setExercise(data);
        setCode(data.template_code || "");
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [lessonId]); // Kuka se ponovno pokreće ako se lessonId promijeni

  const handleRunCode = async () => {
    setChecking(true);
    setIsCorrect(null);
    setOutput("Izvršavam kod...");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/exercises/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ code, exerciseId: exercise.id }),
      });

      const data = await response.json();
      setOutput(data.output || "Nema ispisa.");
      setIsCorrect(data.is_correct);
    } catch (err) {
      setOutput("Greška pri spajanju na server.");
      setIsCorrect(false);
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl text-white mx-auto">
      <h1 className="text-4xl font-bold mb-4">{exercise.title}</h1>
      <div className="mt-2 border-t-2 border-green-600 pt-4">
        <ReactMarkdown components={markdownComponents}>
          {exercise.description}
        </ReactMarkdown>

        <div className="bg-gray-900 rounded-md overflow-hidden border border-gray-700">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => highlight(code, languages.c)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
            }}
          />
        </div>
        <button
          onClick={handleRunCode}
          disabled={checking}
          className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-500 cursor-pointer"
        >
          {checking ? "Izvršavam..." : "Provjeri rješenje"}
        </button>

        <div className="mt-6 min-h-[32px] flex items-center">
          {isCorrect === true && (
            <p className="text-green-500 font-bold">Točno! ✅</p>
          )}
          {isCorrect === false && (
            <p className="text-red-500 font-bold">
              Netočno. Pokušajte ponovno.
            </p>
          )}
        </div>
        <div className="mt-4 mb-2">
          <h4 className="font-bold text-lg">Izlaz:</h4>
          <pre className="bg-black text-white p-4 rounded-md mt-2 whitespace-pre-wrap break-words">
            <code>{output}</code>
          </pre>
        </div>
      </div>
      <div className="mt-12">
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

export default Exercise;
