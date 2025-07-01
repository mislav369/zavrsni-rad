import React from "react";
import { Outlet, Link } from "react-router-dom";

function Layout({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-20">
        <nav className="container mx-auto px-10 sm:px-12 md:px-14 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold group">
            <span className="text-white group-hover:text-sky-300 transition-colors mr-1">
              Nauči
            </span>
            <span className="text-sky-400 group-hover:text-sky-300 transition-colors">
              C
            </span>
          </Link>

          <div className="flex items-center ">
            {user ? (
              <>
                <Link
                  key="dashboard"
                  to="/dashboard"
                  className="px-4 text-white/90 hover:text-sky-400 transition-colors font-semibold"
                >
                  Nadzorna ploča
                </Link>

                <Link
                  key="lessons"
                  to="/lessons"
                  className="px-4 ml-2 text-white/90 hover:text-sky-400 transition-colors font-semibold"
                >
                  Lekcije
                </Link>

                {user.is_admin ? (
                  <Link
                    key="admin"
                    to="/admin"
                    className="ml-2 pl-6 border-l border-gray-600 px-4 font-semibold text-yellow-300 hover:text-yellow-200 transition-colors"
                  >
                    Admin
                  </Link>
                ) : null}

                <button
                  key="logout"
                  onClick={onLogout}
                  className="ml-5 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer"
                >
                  Odjavi se
                </button>
              </>
            ) : (
              <>
                <Link
                  key="login"
                  to="/login"
                  state={{ initialForm: "login" }}
                  className="px-4 text-white/90 hover:text-sky-400 transition-colors font-semibold"
                >
                  Prijava
                </Link>
                <Link
                  key="register"
                  to="/login"
                  state={{ initialForm: "register" }}
                  className="ml-5 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Registracija
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="w-full max-w-5xl mx-auto px-6 py-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
