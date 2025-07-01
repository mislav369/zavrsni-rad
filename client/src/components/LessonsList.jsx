import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function LessonsList() {
  const [lessons, setLessons] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const [lessonsResponse, progressResponse] = await Promise.all([
        fetch("/api/lessons", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!lessonsResponse.ok || !progressResponse.ok) {
        throw new Error("Problem s dohvaćanjem podataka.");
      }

      const lessonsData = await lessonsResponse.json();
      const progressData = await progressResponse.json();

      setLessons(lessonsData.lessons);
      setCompletedIds(progressData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return null;
  }

  return (
    <div className="w-full">
      <h1 className="text-center text-4xl font-semibold text-white mb-8 lg:mb-16 tracking-wide">
        Odaberite lekciju
      </h1>

      <div className="space-y-4">
        {lessons.map((lesson) => {
          const isCompleted = completedIds.includes(lesson.id);
          return (
            <Link
              key={lesson.id}
              to={`/lessons/${lesson.id}`}
              className="bg-gray-800 p-4 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-gray-600 hover:shadow-lg hover:shadow-sky-500/10 hover:scale-105 border-l-4 border-transparent hover:border-sky-500"
            >
              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-sky-300">
                    {lesson.order_num}.
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {lesson.title}
                  </h2>
                </div>
              </div>

              {isCompleted && (
                <div className="flex items-center gap-2 bg-green-900/50 text-green-400 px-4 py-2 rounded-full text-lg font-bold">
                  <span>Završeno</span>
                  <span className="text-base">✅</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default LessonsList;
