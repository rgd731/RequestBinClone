require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const keyRouter = require("./controller/keyRouter");
const viewRouter = require("./controller/viewRouter");

app.use(bodyParser.json());
app.use(cors());

app.use("/", keyRouter);
app.use("/view", viewRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
