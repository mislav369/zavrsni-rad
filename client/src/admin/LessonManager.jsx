import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

function LessonManager() {
  const [lessons, setLessons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/admin/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Greška pri dohvaćanju lekcija.");
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const openDeleteModal = (lessonId) => {
    setLessonToDelete(lessonId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setLessonToDelete(null);
  };

  const confirmDelete = async () => {
    if (lessonToDelete) {
      const token = localStorage.getItem("token");
      await fetch(`/api/admin/lessons/${lessonToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Lekcija obrisana.");
      fetchLessons();
      closeDeleteModal();
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Popis svih lekcija</h1>
        <Link
          to="/admin/lessons/new"
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-1"
        >
          <span className="text-xl">+</span>Dodaj lekciju
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900">
          <thead>
            <tr>
              <th className="px-4 py-3 border-b border-gray-700 text-left text-sm text-sky-400 uppercase">
                Red. br.
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-left text-sm text-sky-400 uppercase">
                Naslov
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-center text-sm text-sky-400 uppercase">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-gray-800">
                <td className="px-4 py-2 border-b border-gray-700">
                  {lesson.order_num}.
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {lesson.title}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center whitespace-nowrap">
                  <Link
                    to={`/admin/lessons/${lesson.id}/edit`}
                    className="inline-block bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 px-3 rounded mr-2"
                    title="Uredi Lekciju"
                  >
                    Uredi
                  </Link>
                  <Link
                    to={`/admin/lessons/${lesson.id}/exercise`}
                    className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded mr-2"
                    title="Uredi Zadatak"
                  >
                    Zadatak
                  </Link>
                  <Link
                    to={`/admin/lessons/${lesson.id}/quiz`}
                    className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-bold py-1 px-3 rounded mr-2"
                    title="Uredi Kviz"
                  >
                    Kviz
                  </Link>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(lesson.id)}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded cursor-pointer"
                    title="Obriši Lekciju"
                  >
                    Ukloni
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Potvrda brisanja"
      >
        Jeste li sigurni da želite obrisati ovu lekciju? Sve povezane vježbe i
        kvizovi će također biti trajno obrisani.
      </ConfirmModal>
    </div>
  );
}

export default LessonManager;
