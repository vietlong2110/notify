/*******************************************************************************
 *                 CONTROLLER FUNCTIONS RELATING TO USERS                      *
 *******************************************************************************/
const Models = require('../database')


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
        if (index == -1) {
            user.keyword_list.push(keyword);
            user.save();
            return Promise.resolve("follow complete");
        }
        return Promise.resolve("keyword already in list")
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = {
    unfollowKeyword,
    followKeyword
};
