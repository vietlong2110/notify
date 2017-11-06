/*******************************************************************************
*                 CONTROLLER FUNCTIONS RELATING TO FACEBOOK                    *
*******************************************************************************/

const FB = require('fb');
const fb = new FB.Facebook({version: 'v2.10'});

const LIMIT = '100';
//temporary access token
const TEST_TOKEN = 'EAAM98EFnHGMBAGxaiKBH98ZAvXkrQaoZADzayhKjQGrTuS4FV55yKaL1NoZA5f8ZCfVzEZANzYWOW5IK7UwREPMqRMy5YZA3fcAE4xFwBa1ErcsdtojMkxRIPPbn3iKRqKlLFhTcZC8uXZCK2moncOCQX5HwgjLQrxHhFvkWqHT7IYuWIF3HdnEeuy8i34834vjc5omwYuvywnEzkpDFNsVB';

/**
* Filter data with only celebs' pages
* @return {Array} - Filtered data
*/
const filterData = (data, filter) => {
  const NEWS_MEDIA_CATEGORIES = [
    'Media/News Company', 'News & Media Website', 'Magazine', 'Newspaper',
    'Broadcasting & Media Production Company'
  ];
  const CELEBRITIES_CATEGORIES = [
    'Musician/Band', 'Actor', 'Politician', 'Public Figure', 'Dancer',
    'Artist', 'Athlete', 'Sports Team'
  ];

  let res = [];

  for (i = 0; i < data.length; i++) {
    let { name, category } = data[i];
    if (filter === 'sources' && NEWS_MEDIA_CATEGORIES.indexOf(category) !== -1)
      res = res.concat(name);
    if (filter === 'following' && CELEBRITIES_CATEGORIES.indexOf(category) !== -1)
      res = res.concat(name);
  }
  return res;
};

/**
* Get user_likes fb pages
* @return {Promise<Array>}
*/
const getUserLikePages = async(access_token = TEST_TOKEN) => {
  try {
    let response = await fb.api('me/likes', {
      access_token,
      limit: LIMIT,
      fields: 'name,category,category_list,website'
    });
    if (response.error)
      return Promise.reject(response.error);

    let data = response.data;
    while (response.paging && response.paging.next) {
      try {
        response = await fb.api('me/likes?after=' + response.paging.cursors.after, {
          access_token,
          limit: LIMIT,
          fields: 'name,category,website'
        });
        if (response.error) //return the beginning part of the data
          return Promise.resolve(data);
        data = data.concat(response.data);
      } catch(err) {
        return Promise.resolve(data);
      }
    }
    return Promise.resolve(data);
  } catch(err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
* Get info of fb user
* @return {Promise<Array>}
*/
const userInfo = async(access_token = TEST_TOKEN) => {
  try {
    let response = await fb.api('/me', {
      access_token,
      fields: 'id,name,email'
    });
    // console.log(response);
    if (response.error)
      return Promise.reject(response.error);

    let { id, name, email } = response;
    response = await fb.api(id + '/picture?redirect=0&type=large', {
      access_token
    });
    if (response.error || !(response.data) || !(response.data.url))
      return Promise.resolve({
        id, name, email,
        profile_picture: null
      });

    let profile_picture = response.data.url;
    return Promise.resolve({
      id, name, email, profile_picture
    })
  } catch(err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports = {
  getUserLikePages,
  userInfo,
  filterData
};
