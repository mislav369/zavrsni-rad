import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";

function ExerciseManager() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    template_code: "",
    expected_output: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExercise = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/exercise`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Greška pri dohvaćanju zadatka.");
      const data = await response.json();
      setExercise(data);
      if (data) {
        setFormData(data);
      } else {
        setFormData({
          title: "",
          description: "",
          template_code: "",
          expected_output: "",
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = exercise ? "PUT" : "POST";
    const url = exercise
      ? `/api/admin/exercises/${exercise.id}`
      : "/api/admin/exercises";
    const body = exercise
      ? formData
      : { ...formData, lesson_id: parseInt(lessonId) };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Greška pri spremanju zadatka.");
      toast.success("Zadatak uspješno spremljen!");
      fetchExercise();
      navigate("/admin/lessons");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmDelete = async () => {
    if (!exercise) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/admin/exercises/${exercise.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Brisanje nije uspjelo.");

      toast.success("Zadatak uspješno obrisan!");

      navigate("/admin/lessons");
      setIsModalOpen(false);
      setExercise(null);
      setFormData({
        title: "",
        description: "",
        template_code: "",
        expected_output: "",
      });
    } catch (error) {
      toast.error(error.message);
      setIsModalOpen(false);
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return null;
  }

  return (
    <div className="text-white bg-gray-800 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        Upravljanje zadatkom za lekciju ID: {lessonId}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Naslov vježbe
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-gray-700 p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Opis vježbe
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-gray-700 p-2 rounded w-full"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Početni kod
            </label>
            <textarea
              name="template_code"
              value={formData.template_code}
              onChange={handleInputChange}
              className="bg-gray-900 text-lime-400 p-2 rounded font-mono w-full"
              rows="8"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Očekivani izlaz
            </label>
            <textarea
              name="expected_output"
              value={formData.expected_output}
              onChange={handleInputChange}
              className="bg-gray-900 text-lime-400 p-2 rounded font-mono w-full"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            {exercise ? "Ažuriraj zadatak" : "Spremi zadatak"}
          </button>
          {exercise && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Obriši zadatak
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
        onConfirm={confirmDelete}
        title="Potvrda brisanja zadatka"
      >
        Jeste li sigurni da želite obrisati ovaj zadatak? Ova akcija je
        nepovratna.
      </ConfirmModal>
    </div>
  );
}

export default ExerciseManager;
