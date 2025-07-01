import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function EditLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    order_num: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/admin/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Lekcija nije pronađena.");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [lessonId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          order_num: parseInt(formData.order_num),
        }),
      });
      if (!response.ok) throw new Error("Greška pri ažuriranju.");

      toast.success("Lekcija uspješno ažurirana!");
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
      <h1 className="text-2xl font-bold mb-6">
        Uređivanje lekcije (ID: {lessonId})
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Naslov lekcije"
            className="bg-gray-700 p-2 rounded"
            required
          />
          <input
            type="number"
            name="order_num"
            value={formData.order_num}
            onChange={handleInputChange}
            placeholder="Redni broj"
            className="bg-gray-700 p-2 rounded"
            required
          />
        </div>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Sadržaj lekcije (Markdown podržan)"
          rows="12"
          className="w-full bg-gray-700 p-2 rounded mb-4"
          required
        ></textarea>
        <div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Ažuriraj lekciju
          </button>
        </div>
      </form>
      <Link
        to="/admin/lessons"
        className="inline-block mt-8 text-sky-400 hover:text-sky-300"
      >
        &larr; Natrag na upravljanje lekcijama
      </Link>
    </div>
  );
}

export default EditLesson;
