const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const router = express.Router();
const db = require("../models");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeDb";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

router.get("/", (req, res) => {
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
          .catch(err => console.log(err.code));
      });
      res.render("index");
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

router.post("/comment/:id", (req, res) => {
  console.log(req.body.name, req.body.comment);
  db.Comment.create({ name: req.body.name, comment: req.body.comment })
    .then(comment => {
      return db.News.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: comment._id } },
        { new: true }
      );
    })
    .then(articleData => {
      res.render("news");
    })
    .catch(err => {
      const error = [];
      if (err.name === "ValidationError") {
        error.push("Please fill in all fields");
        res.render("news", { error });
      } else console.log(err.name);
    });
});

router.get("/comment/:id", (req, res) => {
  db.News.findOne({ _id: req.params.id })
    .populate("comment.Comment")
    .then(function(data) {
      const promises = [];
      const commentArr = [];

      promises.push(
        data.comment.forEach(commentId => {
          promises.push(
            db.Comment.findById(commentId).then(data => {
              commentArr.push({
                id: commentId,
                name: data.name,
                comment: data.comment
              });
            })
          );
        })
      );
      Promise.all(promises).then(() => {
        console.log(commentArr);
        res.json(commentArr);
        return commentArr;
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
