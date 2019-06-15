const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const router = express.Router();
//const db = require("../models");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/news", function(req, res) {
  axios
    .get("https://www.nytimes.com/section/technology")
    .then(function(response) {
      const $ = cheerio.load(response.data);
      //console.log(response);
      $("article").each(function(i, element) {
        var result = {};
        //console.log(this);
        result.title = $(element)
          .children("div")
          .children("h2")
          .text();
        result.link = $(element)
          .children("div")
          .children("h2")
          .children("a")
          .attr("href");
        result.desc = $(element)
          .children("div")
          .children("p")
          .text();
        result.img = $(element)
          .children("figure")
          .children("a")
          .children("img")
          .attr("src");

        //if (result.title) {
        console.log(result);
        //}

        /*  if (result.title) {
        result.push({ title: result.title, link: result.link });
      } */
        // console.log(element);

        //console.log(result);
        //res.json(result);
        //console.log(this.children);
        //res.send(element);
      });
      res.render("news");
    });
});

module.exports = router;
