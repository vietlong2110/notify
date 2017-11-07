/*******************************************************************************
 *                 CONTROLLER FUNCTIONS RELATING TO USERS                      *
 *******************************************************************************/
const Models = require('../database');
const Search = require('./search');
const DEFAULT_SIZE = 20; //return 20 articles by default
const DEFAULT_OFFSET = 0; //return 20 articles by default


const unfollowKeyword = async (user, keyword) => {
    try {
        
        let index = user.keyword_list.indexOf(keyword);
        if (index !== -1) {
            user.keyword_list.splice(index, 1);
            await user.save();
            return Promise.resolve("unfollow complete");
        }
        return Promise.resolve("keyword not already in list")

    } catch (err) {
        return Promise.reject(err);
    }
}

const followKeyword = async (user, keyword) => {
    try {
        // console.log(keyword);
        let index = user.keyword_list.indexOf(keyword);
        if (index === -1) {
            user.keyword_list.push(keyword);
            await user.save();
            return Promise.resolve("follow complete");
        }
        return Promise.resolve("keyword already in list")
    } catch (err) {
        return Promise.reject(err);
    }
};

const groupByTime = async (date) => {
    try {
        var now = new Date(Date.now());
        var yesterday = new Date(now.getTime() - 86400 * 1000);
        if (date.toLocaleDateString() === now.toLocaleDateString()) {
            return Promise.resolve("recent");
        }
        else if (date.toLocaleDateString() === yesterday.toLocaleDateString()) {
            return Promise.resolve("yesterday");
        }
        else {
            return Promise.resolve(date.toLocaleDateString());
        }
        /*var time = moment(date, "DD/MM/YYYY");
        var now = moment().format();
        var yesterday = moment().subtract(1, 'days').startOf('day').toString();
        if (time.isSame(now, 'day')) {
            return Promise.resolve("recent");
        }
        else if (time.isSame(yesterday, 'day')) {
            return Promise.resolve("yesterday");
        }
        else {
            return Promise.resolve(time.format(time._f));
        }*/
    } catch (err) {
        return Promise.reject(err)
    }
};
const connectArticleFromUser = async (user, size, offset) => {

    try {

        let result = await Models.Users.findById(user._id).populate({
            path: 'notify_list',
            select: ({ "_id": 1, "title": 1, "image": 1, "description": 1, "source": 1, "publishedDate": 1 }),

        }).sort({
            publishedDate: -1
        }).exec();
        let notify_list = result.notify_list;
        notify_list.sort(function (a, b) {
            return b.publishedDate - a.publishedDate;
        });

        var sub_notify_list = notify_list.slice(offset, offset + size);

        let payloads = [];
        for (let j = 0; j < sub_notify_list.length; j++) {
            let payload = new Object({
                group: String,
                articles: []
            });
            let group = await groupByTime(sub_notify_list[j].publishedDate);
            var pivot = -1;
            for (let i = 0; i < payloads.length; i++) {
                if (payloads[i]['group'] === group) {
                    pivot = i;
                    break;
                }
            }

            if (pivot === -1) {
                payload['group'] = group;
                payload['articles'].push(sub_notify_list[j]);
                payloads.push(payload);
            } else {
                payloads[pivot]['articles'].push(sub_notify_list[j]);
            }

        }


        return Promise.resolve(payloads);
    } catch (err) {
        return Promise.reject(err);
    }
}


const notifyList = async (user, size = DEFAULT_SIZE, offset = DEFAULT_OFFSET) => {

    try {
        size = Number(size);
        offset = Number(offset);
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
        let articles = await connectArticleFromUser(user, size, offset);
        return Promise.resolve(articles);
    } catch (err) {
        return Promise.reject(err);
    }
};

const getNumberNotify = async (user, size = DEFAULT_SIZE, offset = DEFAULT_OFFSET) => {

    try {
        size = Number(size);
        offset = Number(offset);
        var article_list = [];
        var number_notify = 0;
        for (let i = 0; i < user.keyword_list.length; i++) {
            var results = await Search.searchArticles(user.keyword_list[i]);
            for (let j = 0; j < results.length; j++) {
                if (user.notify_list.indexOf(results[j]._id) === -1) {
                    user.notify_list.push(results[j]._id);
                    number_notify++;
                }
            }

            // await user.save();
        }
        // let articles = await connectArticleFromUser(user, size, offset);
        return Promise.resolve(number_notify);
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = {
    unfollowKeyword,
    followKeyword,
    notifyList,
    getNumberNotify
};
