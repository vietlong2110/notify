/*******************************************************************************
*                 FUNCTIONS RELATING TO FACEBOOK: CRAWL DATA AND SAVE TO DB                    *
*******************************************************************************/

const FB = require('fb');
const fb = new FB.Facebook({ version: 'v2.10' });
const LIMIT = '100';
const TEST_TOKEN = 'EAAM98EFnHGMBAGxaiKBH98ZAvXkrQaoZADzayhKjQGrTuS4FV55yKaL1NoZA5f8ZCfVzEZANzYWOW5IK7UwREPMqRMy5YZA3fcAE4xFwBa1ErcsdtojMkxRIPPbn3iKRqKlLFhTcZC8uXZCK2moncOCQX5HwgjLQrxHhFvkWqHT7IYuWIF3HdnEeuy8i34834vjc5omwYuvywnEzkpDFNsVB';
const TEST_PAGEID = '140284136008345';
const DEFAULT_LANG = 'vi';
const DEFAULT_TIMEOUT = 10000;

const getUserLikePage = async (access_token = TEST_TOKEN) => {
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
                response = await fb.api("me/likes/" + response.paging.cursors.after, {
                    access_token,
                    limit: LIMIT,
                    fields: 'name,category,category_list,website'
                });
                if (response.error)
                    return Promise.resolve(data);
                data = data.concat(response.data);
            } catch (err) {
                return Promise.resolve(data);
            }
        }
        return Promise.resolve(data);
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

const getFanPagePosts = async (page_id = '140284136008345', access_token = TEST_TOKEN) => {
    try {
        let response = await fb.api(page_id + '/posts', {
            access_token,
            limit: LIMIT,
            fields: 'created_time,story,full_picture,message'
        });

        if (response.error)
            return Promise.reject(response.error);
        let data = response.data;
        while (response.paging && response.paging.next) {
            try {
                response = await fb.api(page_id + '/posts/' + response.paging.cursors.next, {
                    access_token,
                    limit: LIMIT,
                    fields: 'created_time,story,full_picture,message'
                })
                if (response.error)
                    return Promise.resolve(data);
                data = data.concat(response.data);
            } catch (err) {
                return Promise.resolve(data);
            }
        }
        return Promise.resolve(data);
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

// getUserLikePage().then(value => {
//     console.log(value);
// })

getFanPagePosts().then( value => console.log(value));
