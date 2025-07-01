const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email i lozinka su obavezni." });
  }

  try {
    const user = await userModel.findByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Neispravan email ili lozinka." });
    }

    const payload = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      is_admin: user.is_admin,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Uspješna prijava!", token: token });
  } catch (error) {
    console.error("Greška prilikom prijave:", error);
    res.status(500).json({ error: "Došlo je do pogreške na serveru." });
  }
};

const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Sva polja su obavezna." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Lozinka mora imati barem 6 znakova." });
  }

  try {
    const userCount = await userModel.getTotalUserCount();
    const isFirstUser = userCount === 0;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      hashedPassword,
      is_admin: isFirstUser ? 1 : 0,
    });

    const payload = {
      id: newUser.id,
      name: `${newUser.first_name} ${newUser.last_name}`,
      is_admin: newUser.is_admin,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "Registracija uspješna!", token: token });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res
        .status(409)
        .json({ error: "Korisnik s tom email adresom već postoji." });
    }

    console.error("Greška prilikom registracije:", error);
    res.status(500).json({ error: "Došlo je do pogreške na serveru." });
  }
};

module.exports = {
  login,
  register,
};
