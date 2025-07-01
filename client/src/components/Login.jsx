import { useState } from "react";
import toast from "react-hot-toast";

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      onLoginSuccess();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-md shadow-lg w-full max-w-md min-h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Prijava
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div>
          <div className="mb-4">
            <input
              type="email"
              id="login-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Email adresa"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="login-password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Lozinka"
              required
              minLength="6"
            />
          </div>

          <div className="h-10 flex items-center justify-center my-9">
            <p className="text-red-400 text-center">
              {message ? message : <>&nbsp;</>}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer"
          >
            Prijavi se
          </button>
        </div>

        <div className="mt-auto text-center">
          <p className="text-sm text-gray-400">
            Nemate račun?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-medium text-sky-400 hover:text-sky-300 cursor-pointer"
            >
              Registrirajte se
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
