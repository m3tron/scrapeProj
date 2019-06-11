const express = require("express");
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3000;

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Connected go to: http://localhost:${PORT}`);
});
