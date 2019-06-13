const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/news", (req, res) => {
  axios.get("https://www.bbc.com/news").then(response => {
    const $ = cheerio.load(response.data);

    $("p").each((i, element) => {
      const result = {};

      result.title = $(this).text();
      console.log(result);
    });
  });

  //res.render("news");
});

module.exports = router;
