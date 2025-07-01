import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function AddLesson() {
  const navigate = useNavigate();
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    order_num: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newLesson,
          order_num: parseInt(newLesson.order_num),
        }),
      });
      if (!response.ok) throw new Error("Greška pri dodavanju lekcije.");

      toast.success("Lekcija uspješno dodana!");
      navigate("/admin/lessons"); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="text-white bg-gray-800 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Dodaj novu lekciju</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="title"
            value={newLesson.title}
            onChange={handleInputChange}
            placeholder="Naslov lekcije"
            className="bg-gray-700 p-2 rounded"
            required
          />
          <input
            type="number"
            name="order_num"
            value={newLesson.order_num}
            onChange={handleInputChange}
            placeholder="Redni broj"
            className="bg-gray-700 p-2 rounded"
            required
          />
        </div>
        <textarea
          name="content"
          value={newLesson.content}
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
            Spremi lekciju
          </button>
        </div>
      </form>
      <Link
        to="/admin/lessons"
        className="inline-block mt-8 text-sky-400 hover:text-sky-300"
      >
        &larr; Natrag na sve lekcije
      </Link>
    </div>
  );
}

export default AddLesson;
