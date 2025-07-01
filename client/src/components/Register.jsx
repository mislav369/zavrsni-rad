import { useState } from "react";
import toast from "react-hot-toast";

function Register({ onLoginSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Lozinke se ne podudaraju.");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Lozinka mora imati barem 6 znakova.");
      return;
    }

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (data.token) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        onLoginSuccess();
      }
    } catch (error) {
      setMessage(error.message || "Došlo je do nepoznate greške.");
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md min-h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Registracija
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="Ime"
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Prezime"
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email adresa"
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Lozinka"
            required
            minLength="6"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Potvrdi lozinku"
            required
            minLength="6"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="h-10 flex items-center justify-center my-2">
          <p className="text-red-400 text-center">
            {message ? message : <>&nbsp;</>}
          </p>
        </div>

        <div className="mt-auto">
          {" "}
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer"
          >
            Registriraj se
          </button>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Već imate račun?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-sky-400 hover:text-sky-300 cursor-pointer"
              >
                Prijavite se
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
