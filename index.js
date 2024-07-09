const express = require("express");
const bodyParser = require("body-parser");
const app = express();

require('dotenv').config()

app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(express.static("public"));

// global configs
global.configs = require("./lib/configs");

// redirect home to Collect demo
app.get("/", (_req, res) => {
  res.redirect("/collect");
});

app.use("/link", require("./routes/link"));
app.use("/collect", require("./routes/collect"));

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Sellbot listening at ${port}`);
});
