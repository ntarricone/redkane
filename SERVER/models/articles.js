const mongoose = require("mongoose");
const { Schema } = mongoose;

const Article = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  multimedia:  String ,
  category: {
    type: String,
    enum: [
      "Environment",
      "Politics",
      "Sports",
      "Tech",
      "World News",
      "Business",
      "Culture",
      "Fashion",
      "Travel",
      "Other"
    ]
  },
  comments: [
    {
      commentUserID: String,
      commentUsername:  String ,
      posted:  Date ,
      commentText: String
    }
  ],
  price:  Number ,
  date: Date ,
  editDate: Date ,
  likes: Number,
  likedIDs: Array,
  saved: Number,
  savedIDs: Array
});

module.exports = mongoose.model("Articles", Article);
