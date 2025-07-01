require("dotenv").config();

const express = require("express");

const app = express();
const PORT = 5000;

const mainApiRouter = require("./routes/index.js");

app.use(express.json());

app.use("/api", mainApiRouter);

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});
