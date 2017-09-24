/*******************************************************************************
*                 CONTROLLER FUNCTIONS RELATING TO FACEBOOK                    *
*******************************************************************************/

const FB = require('fb');
const fb = new FB.Facebook({version: 'v2.9'});

const LIMIT = '100';
//temporary access token
const ACCESS_TOKEN = 'EAAM98EFnHGMBAJK4jSxhzpB75Gx8Nlt64PiBAaVc3e42EN6clNcPUMwANHVVlZCfva8lYZB3fnZCUuE34U6CHabjx8beCwi1x8DA5nz6GQz5hkacZBzROQVDXxC9qmpZA0rzNo9wWOuM1lGpJ4YoVXvC9NkhoZBJr5ZAFUg6i6suRlFfjLVmYxZCPLiD5vHzZB2vlm0AvSXHXggZDZD';

/**
* Filter data with only celebs' pages
* @return {Array} - Filtered data
*/
const filterData = data => {
  const NEWS_MEDIA_CATEGORIES = [
    'Media/News Company', 'News & Media Website', 'Magazine', 'Newspaper',
    'Broadcasting & Media Production Company'
  ];
  const CELEBRITIES_CATEGORIES = [
    'Musician/Band', 'Actor', 'Politician', 'Public Figure', 'Dancer',
    'Artist', 'Athlete', 'Sports Team'
  ];

  let res = {
    sources: [],
    following: []
  };

  for (i in data) {
    let { id, name, category, category_list, website } = data[i];
    if (category_list) {
      let list = category_list;
      for (j in list) {
        if (NEWS_MEDIA_CATEGORIES.indexOf(list[j].name) !== -1) {
          res.sources = res.sources.concat({ id, name, website });
          break;
        }
        if (CELEBRITIES_CATEGORIES.indexOf(list[j].name) !== -1) {
          res.following = res.following.concat({ id, name, website });
          break;
        }
      }
    }
    else {
      if (NEWS_MEDIA_CATEGORIES.indexOf(category) !== -1)
        res.sources = res.sources.concat({ id, name, website });
      if (CELEBRITIES_CATEGORIES.indexOf(category) !== -1)
        res.following = res.following.concat({ id, name, website });
    }
  }
  return res;
};

/**
* Get user_likes fb pages
* @return {Promise<Array>}
*/
const getUserLikePages = async(access_token = ACCESS_TOKEN) => {
  try {
    let response = await fb.api('me/likes', {
      access_token,
      limit: LIMIT,
      fields: 'name,category,category_list,website'
    });
    if (response.error)
      return Promise.reject(response.error);

    let data = response.data;
    while (response.paging.next) {
      try {
        response = await fb.api('me/likes?after=' + response.paging.cursors.after, {
          access_token,
          limit: LIMIT,
          fields: 'name,category,category_list,website'
        });
        if (response.error) //return the beginning part of the data
          return Promise.resolve(filterData(data));
        data = data.concat(response.data);
      } catch(err) {
        return Promise.resolve(filterData(data));
      }
    }
    return Promise.resolve(filterData(data));
  } catch(err) {
    return Promise.reject(err);
  }
};

module.exports = {
  getUserLikePages
};
