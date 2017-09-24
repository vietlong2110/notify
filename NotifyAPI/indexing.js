/*******************************************************************************
*           INDEXING EVERY ARTICLES OF THE APP HERE (NEWS OR SOCIAL)           *
*******************************************************************************/

const { fetchNews } = require('./scraping/news');
const { Sources } = require('./database');

let cache = [];

const indexNews = async() => {
  while (1) {
    try {
      cache = await Sources.find().exec();
    } catch(err) {
      console.log(err);
    }
    while (cache.length > 0) {
      let source = cache[0].source;
      let feeds = cache[0].links;
      // console.log(feeds);
      for (let i = 0; i < feeds.length; i++) {
        // console.log(feeds[i]);
        try {
          await fetchNews(feeds[i], 'vi', source);
        } catch(err) {
          // console.log(err);
        }
      }
      cache.shift();
    }
  }
};

indexNews();
