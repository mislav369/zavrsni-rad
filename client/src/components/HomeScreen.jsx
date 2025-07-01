import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

function HomeScreen({ onLoginSuccess }) {
  const location = useLocation();
  const [activeForm, setActiveForm] = useState("login");

  useEffect(() => {
    if (location.state?.initialForm === "register") {
      setActiveForm("register");
    } else {
      setActiveForm("login");
    }
  }, [location.state]);

  const toggleForm = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-16">
      <div className="max-w-xl text-center -ml-8">
        <h2 className="text-5xl font-extrabold mb-4 leading-tight">
          Naučite osnove <span className="text-sky-400">C</span> programiranja
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Ova interaktivna aplikacija vam pomaže da korak po korak usvojite C
          programiranje kroz teorijske lekcije, praktične zadatke i kvizove za
          provjeru znanja, bilo da ste potpuni početnik ili želite ponoviti
          temeljne koncepte.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <p className="border-2 border-green-500 text-green-400 font-semibold py-2 px-5 rounded-full">
            ✓ Zadaci
          </p>
          <p className="border-2 border-teal-500 text-teal-400 font-semibold py-2 px-5 rounded-full">
            ✓ Kvizovi
          </p>
          <p className="border-2 border-purple-500 text-purple-400 font-semibold py-2 px-5 rounded-full">
            ✓ Praćenje napretka
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-md">
        {activeForm === "login" ? (
          <Login
            onLoginSuccess={onLoginSuccess}
            onSwitchToRegister={() => toggleForm("register")}
          />
        ) : (
          <Register
            onLoginSuccess={onLoginSuccess}
            onSwitchToLogin={() => toggleForm("login")}
          />
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
