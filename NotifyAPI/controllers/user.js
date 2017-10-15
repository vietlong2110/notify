/*******************************************************************************
 *                 CONTROLLER FUNCTIONS RELATING TO USERS                      *
 *******************************************************************************/
const Models = require('../database');
const Search = require('./search');

const unfollowKeyword = async (user, keyword) => {
  try {

    let index = user.keyword_list.indexOf(keyword);
    if (index !== -1) {
      user.keyword_list.splice(index, 1);
      user.save();
      return Promise.resolve("unfollow complete");
    }
    return Promise.resolve("keyword not already in list")

  } catch (err) {
    return Promise.reject(err);
  }
}


const followKeyword = async (user, keyword) => {
  try {

    let index = user.keyword_list.indexOf(keyword);
    if (index === -1) {

      user.keyword_list.push(keyword);
      user.save();
      return Promise.resolve("follow complete");
    }
    return Promise.resolve("keyword already in list")
  } catch (err) {
    return Promise.reject(err);
  }
};


const connectArticleFromUser = async (user) => {

  try {

    let result = await Models.Users.findById(user._id).populate({
      path: 'notify_list',
      select: ({"_id": 1, "title": 1, "image": 1, "description": 1, "source": 1, "publishedDate": 1}),

    }).sort({
      publishedDate: -1
    }).exec();
    let notify_list = result.notify_list;
    notify_list.sort(function (a, b) {
      return b.publishedDate - a.publishedDate;
    });
    return Promise.resolve(notify_list);
  } catch (err) {
    return Promise.reject(err);
  }
}


const notifyList = async (user) => {

  try {
    var article_list = [];
    for (let i = 0; i < user.keyword_list.length; i++) {
      var results = await Search.searchArticles(user.keyword_list[i]);
      for (let j = 0; j < results.length; j++) {
        if (user.notify_list.indexOf(results[j]._id) === -1) {
          user.notify_list.push(results[j]._id);
        }
      }

      await user.save();
    }
    let articles = await connectArticleFromUser(user);

    return Promise.resolve(articles);
  } catch (err) {
    return Promise.reject(err);
  }
};

//
// const saveArticles = async (user, id) => {
//     try {
//         var message;
//         let index = user.saved_articles.indexOf(id);
//         if (index === -1) {
//             user.saved_articles.push(ObjectID(id));
//             user.save();
//             message = "save complete";
//         } else {
//             message = "article already in list";
//         }
//         return Promise.resolve(message);
//     }catch (err){
//         return Promise.reject(err);
//     }
// };
//
// const unsaveArticles = async (user, id) => {
//     try {
//         var message;
//         let index = user.saved_articles.indexOf(id);
//         if (index !== -1) {
//             user.saved_articles.splice(index, 1);
//             user.save();
//             message = "unsave complete";
//         } else {
//             message = "article not in list";
//         }
//         return Promise.resolve(message);
//     }catch (err){
//         return Promise.reject(err);
//     }
// };
//
// const getSavedArticles = async (user) => {
//     try {
//         let result = await Models.Users.findById(user._id).populate({
//             path: 'saved_articles',
//             select: ({"_id": 1, "title": 1, "image": 1, "description": 1, "source": 1, "publishedDate": 1}),
//
//         }).sort({
//             publishedDate: -1
//         }).exec();
//
//         let saved_articles = result.saved_articles;
//         saved_articles.sort(function (a, b) {
//             return b.publishedDate - a.publishedDate;
//         })
//         return Promise.resolve(saved_articles);
//     } catch (err) {
//         return Promise.reject(err);
//     }
//}


module.exports = {
  unfollowKeyword,
  followKeyword,
  notifyList


};
