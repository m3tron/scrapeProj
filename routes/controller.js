const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const router = express.Router();
const db = require("../models");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeDb";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/scrape", (req, res) => {
  axios
    .get("https://www.technewsworld.com/perl/section/developers/")
    .then(response => {
      const $ = cheerio.load(response.data);
      const storyURL = "https://www.technewsworld.com";
      const imgURL = "https://www.technewsworld.com";

      $("table.section-table").each((i, element) => {
        const news = {};

        news.title = $(element)
          .find("a")
          .text();
        news.link =
          storyURL +
          $(element)
            .find("a")
            .attr("href");
        news.desc = $(element)
          .find("td")
          .children("div")
          .text();
        news.img =
          imgURL +
          $(element)
            .find("img")
            .attr("src");

        db.News.create(news)
          .then(data => {
            console.log("done");
          })
          .catch(err => console.log("News article already in db"));
      });
      res.render("news");
    })
    .catch(err => console.log(err));
});

router.get("/news", (req, res) => {
  db.News.find({})
    .then(news => {
      res.render("news", { news });
    })
    .catch(err => console.log(err));
});

module.exports = router;
