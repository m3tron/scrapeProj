const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const router = express.Router();
const db = require("../models");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeDb";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

//scrape on page load
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
      //once scrapping is done then render view
      res.render("index");
    })
    .catch(err => console.log(err));
});

//retrieve news articles from database
router.get("/news", (req, res) => {
  db.News.find({})
    .then(news => {
      //render news view with news object sent to newsArticle partial
      res.render("news", { news });
    })
    .catch(err => console.log(err));
});

//post new comment
router.post("/comment/:id", (req, res) => {
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
      //doesn't seem to be working(maybe issue with modal)
      const error = [];
      if (err.name === "ValidationError") {
        error.push("Please fill in all fields");
        res.render("news", { error });
      } else console.log(err.name);
    });
});

//retrive comments for an article
router.get("/comment/:id", (req, res) => {
  db.News.findOne({ _id: req.params.id })
    .populate("comment.Comment")
    .then(data => {
      //resend new comments
      populateComment(data, res);
    })
    .catch(err => console.log(err));
});

/*Need to work on deleting comment
-removes comment from comment model
-need to access array inside news.comment*/
/* router.get("/delete/:artId/:id", (req, res) => {
  
  db.Comment.deleteOne({ _id: req.params.id })
    .then(data => {
      db.News.findOneAndUpdate(
        { _id: req.params.artId },
        { $pull: { comment: req.params.id } },
        { new: true }
      );
    })
    .then(data => {
      db.News.findOne({ _id: req.params.artId })
        .populate("comment.Comment")
        .then(data => {
          populateComment(data, res);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}); */

populateComment = (data, res) => {
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
  /*push promises into promises array
  then make Promise to complete promises
  then send response*/
  Promise.all(promises).then(() => {
    res.json(commentArr);
  });
};

module.exports = router;
