/*******************************************************************************
*                 FUNCTIONS RELATING TO FACEBOOK: CRAWL DATA AND SAVE TO DB                    *
*******************************************************************************/

const FB = require('fb');
const fb = new FB.Facebook({ version: 'v2.10' });
const LIMIT = '100';
const TEST_TOKEN = 'EAAM98EFnHGMBAGxaiKBH98ZAvXkrQaoZADzayhKjQGrTuS4FV55yKaL1NoZA5f8ZCfVzEZANzYWOW5IK7UwREPMqRMy5YZA3fcAE4xFwBa1ErcsdtojMkxRIPPbn3iKRqKlLFhTcZC8uXZCK2moncOCQX5HwgjLQrxHhFvkWqHT7IYuWIF3HdnEeuy8i34834vjc5omwYuvywnEzkpDFNsVB';
const TEST_PAGEID = '140284136008345';
const DEFAULT_LANG = 'vi';
const DEFAULT_TIMEOUT = 20000;
const { Articles } = require('../database');

const timeout = (ms = DEFAULT_TIMEOUT) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
            fields: 'created_time,story,message,full_picture,type,description,link,attachments'
        });

        if (response.error)
            return Promise.reject(response.error);
        let data = response.data;
        while (response.paging && response.paging.cursors.after) {
            try {
                response = await fb.api(page_id + '/posts/' + response.paging.cursors.next, {
                    access_token,
                    limit: LIMIT,
                    fields: 'created_time,story,message,full_picture,type,description,link,attachments'
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

const extractContent = async (link, created_time, id, message, story, full_picture) => {
    try {
        // let link = link ;
        let publishedDate = created_time;
        let source = id ;
        let content = message ;
        let title = "title" ;
        let image = full_picture ;
        // let tags = '';
        let description = 'facebook';
        let data = {
            link: link, publishedDate: publishedDate, source: source,
            content: content,
            title: title ,
            image: image,
            // tags: tags,
            description: description 
        };
        // console.log(data);
        console.log('Extracted ' + link);
        return Promise.resolve(data);
    } catch (err) {
        console.log('ERROR OCCURED when EXTRACTING ');
        return Promise.reject(err);
    }
};

const saveArticle = async (data, language = DEFAULT_LANG) => {
    let { link, publishedDate, content, title, image, source, description } = data;
    try {
        let newArticle = new Articles({
            link, publishedDate, content, title, image, source, description
        });
        await newArticle.save();
        console.log('Indexed ' + link);
        return Promise.resolve();
    } catch (err) {
        console.log('ERROR OCCURED when INDEXING ' + link);
        return Promise.reject(err);
    }
};
// getUserLikePage().then(value => {
//     console.log(value);
// })

const fetchFbFanpage = async (access_token = TEST_TOKEN, language = DEFAULT_LANG) => {
    let user_liked_pages = await getUserLikePage(access_token);
    // console.log(user_liked_pages);
    for (let i=0; i< user_liked_pages.length; i++) {
        console.log("fetching "+user_liked_pages[i]);
        try {
            let page_posts = await getFanPagePosts(user_liked_pages[i].id, access_token);
            await timeout();
            for (let j=0; j<page_posts.length; j++) {
                try {
                    let {link, created_time, id, message, story, full_picture} = page_posts[j]; 
                    let post_data = await extractContent(link, created_time, id, message, story, full_picture);
                    await saveArticle(post_data, language);
                } catch (err) {
                    console.log(err);
                }
            }

        } catch (err) {
            console.log(err);
        }
    }
}

fetchFbFanpage();
// getFanPagePosts().then(value => console.log(value));
