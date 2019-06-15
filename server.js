const express = require("express");
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static('public'))

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use("/", require("./routes/controller"));

app.listen(PORT, () => {
  console.log(`Connected go to: http://localhost:${PORT}`);
});
