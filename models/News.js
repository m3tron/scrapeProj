const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  link: { type: String, required: true },
  desc: { type: String, required: true },
  comment: {
    type: [Schema.Types.ObjectId],
    ref: "Comment"
  }
});

const News = mongoose.model("News", NewsSchema);

module.exports = News;
