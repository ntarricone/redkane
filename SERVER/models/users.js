const mongoose = require("mongoose");
const { Schema } = mongoose;

const Users = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  profession: [
    {
      type: String,
      enum: [
        "Journalist",
        "Photographer",
        "Youtuber",
        "Audiovisual Producer",
        "Other"
      ]
    }
  ],
  avatar: String,
  preferences: [ //how to create an array to show different preferences //NOT NECESSARY*******
    {
      type: String,
      enum: ["Videos", "Photos", "Articles"]
    }
  ],

  // socialNetworks: {
  //   facebook: String,
  //   instagram: String,
  //   twitter: String,
  //   linkedin: String
  // },

  //saved media from other users
  savedArticles: Array,
  savedImages: Array,
  savedVideos: Array,

  //reputation in redKane
  followingCount: Number,
  followingIDs: Array,
  followersCount: Number,
  followersIDs: Array,
   
  isAdmin: Boolean
});

module.exports = mongoose.model("Users", Users);
