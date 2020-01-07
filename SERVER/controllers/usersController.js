const users = require("../models/users.js");
const usersController = {};

//Middleware
let sha1 = require("sha1");
let validator = require("email-validator");
let jwt = require("jsonwebtoken");

//CONSTANTS
const jwtKey = "mySecretKey";

//USER LOGIN
usersController.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) res.status(401).end();
  else {
    const user = await users.find({
      email: email,
      password: sha1(password)
    });
    if (user && user.length) {
      let [{ _id, isAdmin }] = user;
      
      const token = jwt.sign(
        {
          _id,
          email,
          isAdmin: Boolean(isAdmin)
        },
        jwtKey
      );
      res.json({ token });
    } else {
      res.sendStatus(400);
    }
  }
};

//CREATE NEW USERS
usersController.createUser = async (req, res) => {
  const {
    name,
    lastname,
    email,
    password,
    description,
    profession,
    avatar,
    preferences,
    socialNetworks
  } = req.body;
  const user = new users({
    name: name,
    lastname: lastname,
    email: validator.validate(email) ? email : "not valid", //HERE THERE NEEDS TO GO AN ERROR

    //ERROR - CODE TO VALIDATE EMAIL NOT WORKING
    //  validateEmailAccessibility(email).then(function(valid) {
    //       if (valid) {
    //          email
    //       } else {
    //        "repeated email address";
    //       }
    //     })

    password: sha1(password),
    avatar: avatar,
    description: description,
    profession: profession,
    preferences: preferences
    // socialNetworks: socialNetworks,
  });

  //ERROR, CANNOT ACCESS user BEFORE INITIALISATION, DO I NEED A PROMISE?
  //   function validateEmailAccessibility(email){

  //    return user.findOne({email: email}).then(function(result){
  //         return result !== null;
  //    });
  // }
  await user.save();
  res.json({
    user
  });
};

//GET ALL USERS
usersController.getUsers = async (req, res) => {
  users.find({}, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error 500" });
    }
    if (!results) {
      res.status(404).send({ message: "no existen usuarios para mostrar" });
    }
    res.json(results);
  });
};

//GET USER BY ID
usersController.getUser = async (req, res) => {
  const user = await users.findById(req.params.id);
  res.json(user);
};

//EDIT USER
usersController.editUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    lastname,
    email,
    password,
    description,
    profession,
    avatar,
    preferences
  } = req.body;

  await users.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
        lastname: lastname,
        email: validator.validate(email) ? email : "not valid", //HERE THERE NEEDS TO GO AN ERROR
        password: sha1(password),
        avatar: avatar,
        description: description,
        profession: profession,
        preferences: preferences
      }
    },
    { new: true }
  );
  res.json({ status: "Usuario actualizado" });
};

//DELETE USER
usersController.deleteUser = async (req, res) => {
  const { id } = req.params;
  await users.findByIdAndRemove(id);
  res.json({ status: "Eliminado" });
};

//SAVE ARTICLE
usersController.saveArticle = async (req, res) => {
  const { id } = req.params;
  const { _id: articleId } = req.body;

  const user = await users.findById(id);
  const alreadySaved = user.savedArticles.includes(articleId);

  if (alreadySaved) res.json({ status: "Article already saved" });
  else {
    await users.findByIdAndUpdate(id, {
      $push: {
        savedArticles: articleId
      }
    });
    res.json({ status: "article saved" });
  }
};

//UNSAVE ARTICLE
usersController.unsaveArticle = async (req, res) => {
  const { id } = req.params;
  const { _id: articleId } = req.body;

  const user = await users.findById(id);
  const alreadySaved = user.savedArticles.includes(articleId);

  if (!alreadySaved)
    res.json({ status: "Article not saved in the first place" });
  else {
    await users.findByIdAndUpdate(id, {
      $pull: {
        savedArticles: articleId
      }
    });
    res.json({ status: "article unsaved" });
  }
};

//FOLLOW USER
usersController.followUser = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.body;

  const user = await users.findById(id);
  const alreadyFollowed = user.followingIDs.includes(userId);

  if (alreadyFollowed) res.json({ status: "User already being followed" });
  else {
    await users.findByIdAndUpdate(id, {
      $push: {
        followingIDs: userId
      },
      $inc: {
        followingCount: 1
      }
    });
    //HERE I´M UPDATING THE TARGETED USER´S FOLLOWERS COUNT
    await users.findByIdAndUpdate(userId, {
      $push: {
        followersIDs: id
      },
      $inc: {
        followersCount: 1
      }
    });
    res.json({ status: "You are now following this user" });
  }
};

//UNFOLLOW ANOTHER USER
usersController.unfollowUser = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.body;

  const user = await users.findById(id);
  const alreadyFollowed = user.followingIDs.includes(userId);

  if (!alreadyFollowed)
    res.json({ status: "You cannot unfollow if you are not following" });
  else {
    await users.findByIdAndUpdate(id, {
      $pull: {
        followingIDs: userId
      },
      $inc: {
        followingCount: -1
      }
    });
    //HERE I´M UPDATING THE TARGETED USER´S FOLLOWERS COUNT
    await users.findByIdAndUpdate(userId, {
      $pull: {
        followersIDs: id
      },
      $inc: {
        followersCount: -1
      }
    });
    res.json({ status: "You've now unfolled this user" });
  }
};
module.exports = usersController;
