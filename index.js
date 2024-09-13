const express = require("express");
const keyRouter = require("./controller/keyRouter");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

app.use("/", keyRouter);
// app.use("/view");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
