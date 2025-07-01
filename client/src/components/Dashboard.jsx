import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const progressPercentage =
    data?.totalLessons > 0
      ? Math.round((data.completedLessons / data.totalLessons) * 100)
      : 0;

  const firstName = data?.name ? data.name.split(" ")[0] : "";
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  if (loading) {
    return null;
  }

  return (
    <div className="py-8 lg:py-0">
      <h1 className="text-center text-4xl font-semibold text-white mb-8 lg:mb-16 tracking-wide">
        Dobro došli, {capitalizedFirstName}!
      </h1>

      <>
        {data.streak > 0 && (
          <div className="mb-12 bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-lg flex items-center justify-center gap-3 shadow-lg">
            <p className="text-3xl font-bold text-white">{data.streak}</p>
            <span className="text-3xl">🔥</span>
            <p className="text-amber-100 font-semibold">
              Prijavi se svaki dan i nastavi svoj niz!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center text-center min-h-[250px]">
            <h2 className="text-xl font-bold text-sky-400 mb-4">
              Ukupan napredak
            </h2>
            <div className="w-32 h-32">
              <CircularProgressbar
                value={progressPercentage}
                text={`${progressPercentage}%`}
                background
                backgroundPadding={6}
                styles={buildStyles({
                  backgroundColor: "#374151",
                  textColor: "#fff",
                  pathColor: "#34d399",
                  trailColor: "#4b5563",
                  textSize: "20px",
                })}
              />
            </div>
            <p className="text-gray-400 mt-4">
              {data.completedLessons} / {data.totalLessons} završene lekcije
            </p>
          </div>

          <div className="bg-sky-900/50 border-2 border-sky-500 p-6 rounded-lg flex flex-col justify-between hover:border-sky-400 transition-colors min-h-[250px]">
            {data.nextLesson ? (
              <div className="text-center">
                <h2 className="text-xl font-bold text-sky-400 mb-2">
                  Nastavi s učenjem
                </h2>
                <p className="text-sm text-sky-200/80 mb-4">
                  Vaša sljedeća lekcija je spremna.
                </p>
                <p className="text-2xl font-semibold text-white">
                  {data.nextLesson.order_num}. {data.nextLesson.title}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-bold text-green-400 mb-2">
                  Čestitamo!
                </h2>
                <p className="text-2xl font-semibold text-white">
                  Završili ste sve dostupne lekcije!
                </p>
              </div>
            )}
            {data.nextLesson && (
              <Link
                to={`/lessons/${data.nextLesson.id}`}
                className="mt-6 bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors w-full"
              >
                Otvori lekciju
              </Link>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg flex flex-col justify-between min-h-[250px]">
            {data.lastCompletedLesson ? (
              <div className="text-center">
                <h2 className="text-xl font-bold text-green-400 mb-2">
                  Nedavno završeno ✅
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Odličan posao! Posljednje ste savladali:
                </p>
                <p className="text-2xl font-semibold text-white">
                  {data.lastCompletedLesson.order_num}.{" "}
                  {data.lastCompletedLesson.title}
                </p>
              </div>
            ) : (
              <div className="text-center self-center">
                <h2 className="text-xl font-bold text-sky-400 mb-2">
                  Nedavno završeno
                </h2>
                <p className="text-gray-400">
                  Nemate završenih lekcija, krenite s učenjem.
                </p>
              </div>
            )}
            {data.lastCompletedLesson && (
              <Link
                to={`/lessons/${data.lastCompletedLesson.id}`}
                className="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors w-full"
              >
                Ponovi lekciju
              </Link>
            )}
          </div>
        </div>
      </>
    </div>
  );
}

export default Dashboard;
