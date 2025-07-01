import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import ScrollToTop from "./components/ScrollToTop";

// Glavni Layout
import Layout from "./components/Layout";

// Stranice
import HomeScreen from "./components/HomeScreen";
import Dashboard from "./components/Dashboard";
import LessonsList from "./components/LessonsList";
import Lesson from "./components/Lesson";
import Exercise from "./components/Exercise";
import Quiz from "./components/Quiz";

// Admin Stranice
import UserList from "./admin/UserList";
import LessonManager from "./admin/LessonManager";
import EditLesson from "./admin/EditLesson";
import ExerciseManager from "./admin/ExerciseManager";
import QuizManager from "./admin/QuizManager";
import AdminLayout from "./admin/AdminLayout";
import AddLesson from "./admin/AddLesson";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);

          fetch("/api/activity/log", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      setUser(null);
    }
  }, []);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);

        fetch("/api/activity/log", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        // --------------------------
      } catch (error) {
        setUser(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />

      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={<Layout user={user} onLogout={handleLogout} />}
        >
          <Route
            index
            element={
              !user ? (
                <HomeScreen onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="login"
            element={
              !user ? (
                <HomeScreen onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          <Route
            path="dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="lessons"
            element={user ? <LessonsList /> : <Navigate to="/login" />}
          />
          <Route
            path="lessons/:lessonId"
            element={user ? <Lesson /> : <Navigate to="/login" />}
          />
          <Route
            path="/lessons/:lessonId/exercise"
            element={user ? <Exercise /> : <Navigate to="/login" />}
          />
          <Route
            path="/lessons/:lessonId/quiz"
            element={user ? <Quiz /> : <Navigate to="/login" />}
          />

          <Route
            path="admin"
            element={
              user?.is_admin ? <AdminLayout /> : <Navigate to="/dashboard" />
            }
          >
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UserList />} />
            <Route path="lessons" element={<LessonManager />} />

            <Route path="lessons/new" element={<AddLesson />} />
            <Route path="lessons/:lessonId/edit" element={<EditLesson />} />
            <Route
              path="lessons/:lessonId/exercise"
              element={<ExerciseManager />}
            />
            <Route path="lessons/:lessonId/quiz" element={<QuizManager />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
