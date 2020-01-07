const articles = require("../models/articles.js");
const articlesController = {};

//CREATE ARTICLE
articlesController.createArticle = async (req, res) => {
  const { userId, title, text, multimedia, category, price } = req.body;
  const article = new articles({
    userId: userId,
    title: title,
    text: text,
    multimedia: multimedia,
    category: category,
    price: price,
    date: new Date()
  });

  await article.save();
  res.json({
    article
  });
};

//GET ALL ARTICLES
articlesController.getArticles = async (req, res) => {
  articles.find({}, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error 500" });
    }
    if (!results) {
      res.status(404).send({ message: "No articles found" });
    }
    res.json(results);
  });
};

//ARTICLES LIKED BY AN USER
articlesController.getArticleLikedByUser = async (req, res) => {
  const { id: userId } = req.params;
  articles.find({likedIDs: userId}, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error 500" });
    }
    if (!results) {
      res.status(404).send({ message: "No articles found" });
    }
    res.json(results);
  })
  };

//OPEN SINGLE ARTICLE
articlesController.getArticle = async (req, res) => {
  const { id } = req.params;
  const article = await articles.findById(id);
  res.json(article);
};

//EDIT ARTICLE
articlesController.editArticle = async (req, res) => {
  const { id } = req.params;
  const { title, text, multimedia, category, price } = req.body;
  const editDate = new Date();
  const article = { title, text, multimedia, category, price, editDate };
  await articles.findByIdAndUpdate(id, { $set: article }); //WHY DOES IT ALLOW ME TO ADD ANYTHING ON ENUMS?
  res.json({ status: "Article updated" });
};

//DELETE ARTICLE
articlesController.deleteArticle = async (req, res) => {
  const { id } = req.params;
  await articles.findByIdAndDelete(id);
  res.json({ status: "Article deleted" });
};

//LIKE AN ARTICLE
articlesController.likeArticle = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const article = await articles.findById(id);
  var duplicate = article.likedIDs.includes(userId);
  if (duplicate) res.json({ status: "user already gave like" });
  else {
    await articles.findByIdAndUpdate(id, {
      $push: { likedIDs: userId },
      $inc: { likes: 1 }
    });
    res.json({ status: "Article liked" });
  }
};

//DISLIKE AN ARTICLE
articlesController.dislikeArticle = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const article = await articles.findById(id);
  var liked = article.likedIDs.includes(userId);
  console.log(liked)
  if (!liked) res.json({ status: "you haven´t liked this article yet" });
  else {
    await articles.findByIdAndUpdate(id, {
      $pull: { likedIDs: userId },
      $inc: { likes: -1 }
    });
    res.json({ status: "Article disliked" });
  }
};



module.exports = articlesController;
