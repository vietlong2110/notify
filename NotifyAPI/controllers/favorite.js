/*******************************************************************************
 *                 CONTROLLER FUNCTIONS RELATING TO FAVORITES                      *
 *******************************************************************************/
const Models = require('../database')
const ObjectID = require("bson-objectid");
var mongoose = require('mongoose');

const saveFavorites = async (user, id) => {
  try {
    var message;
    var article = await Models.Articles.findById(id).exec();
    if (article !== null) {

      let favorites = Models.Favorites({
        user_id: user._id,
        article: mongoose.Types.ObjectId(id),
        saved_date: Date.now()
      });
      await favorites.save();

      message = "save complete";
    } else {
      message = "article not in DB"
    }
    return Promise.resolve(message);

  } catch (err) {
    return Promise.reject(err);
  }
};
const unsaveFavorites = async (user, id) => {
  try {
    var message;
    await Models.Favorites.remove({'user_id': user._id, 'article': mongoose.Types.ObjectId(id)}).exec();
    message = "remove complete";
    return Promise.resolve(message);
  } catch (err) {
    return Promise.reject(err);
  }
};
const getSavedFavorites = async (user) => {
  try {
    let results = await Models.Favorites.find({'user_id': user._id}).populate('article').exec();


    // let result = await Models.Favorites.find({'user_id':user._id}).exec();

    results.sort(function (a, b) {
      return b.saved_date - a.saved_date;
    });
    var articles = [];
    for (let i = 0; i < results.length; i++) {
      articles.push(results[i].article);
    }
    return Promise.resolve(articles);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  saveFavorites,
  unsaveFavorites,
  getSavedFavorites

};