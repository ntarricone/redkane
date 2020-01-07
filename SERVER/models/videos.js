const mongoose = require("mongoose");
const { Schema } = mongoose;

const Video = new Schema({
  userId: { type: String, required: true },
  route: { type: String, required: true },
  description: String,
  
  comments: [
    {
      commentUserID: String,
      commentUsername:  String ,
      posted:  Date ,
      commentText: String
    }
  ],
  price:  Number,
  date: Date,
  editDate: Date,
  likes: Number,
  likedIDs: Array,
  saved: Number,
  savedIDs: Array
});

module.exports = mongoose.model("Videos", Video);
