/*******************************************************************************
 *                 CONTROLLER FUNCTIONS RELATING TO USERS                      *
 *******************************************************************************/
const Models = require('../database')
const Search = require('./search')

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


const connectArticleFromUser = async (arrayList) => {

    try {

        var articles = [];
        for (let i = 0; i < arrayList.length; i++) {
            let result = await  Models.Articles.findById(arrayList[i])
                .select({"_id": 1, "title": 1, "image": 1, "description": 1, "source": 1, "publishedDate": 1})
                .exec();
            articles.push(result);
        }
        return Promise.resolve(articles);
    } catch (err) {
        return Promise.reject(err);
    }
}


const notifyList = async (user) => {

    try {
        var article_list = [];
        for (let i = 0; i < user.keyword_list.length; i++) {
            var results = await Search.searchArticles(user.keyword_list[i]);

            try {
                await results.forEach(function (result) {
                    if (user.notify_list.indexOf(result._id) === -1) {
                        user.notify_list.push(result._id);
                    }
                })

            } catch (err) {
                console.log(err);
            }
            await user.save();
        }
        let articles = await connectArticleFromUser(user.notify_list);

        return Promise.resolve(articles);
    } catch (err) {
        return Promise.reject(err);
    }
};


module.exports = {
    unfollowKeyword,
    followKeyword,
    notifyList
};
