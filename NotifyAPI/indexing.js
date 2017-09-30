/*******************************************************************************
*           INDEXING EVERY ARTICLES OF THE APP HERE (NEWS OR SOCIAL)           *
*******************************************************************************/
// const Promise = require('bluebird');
// const fs = Promise.promisifyAll(require('fs'));

const { fetchNews } = require('./scraping/news');
const { Sources } = require('./database');

let cache = [];

// const printSources = async() => {
//   let sources = await Sources.find().exec();
//   let writeArr = [];
//   for (i = 0; i < sources.length; i++)
//     writeArr = writeArr.concat({
//       source: sources[i].source,
//       links: sources[i].links
//     });
//   fs.writeFileAsync('./seeds/source.json', JSON.stringify(writeArr), 'utf-8')
//   .then(() => {
//     console.log('Initialize seeds successfully');
//   }).catch(err => {
//     console.log(err);
//   })
// };

const initialize = async() => {
  const sourceSeed = require('./seeds/source.json');
  console.log('Checking exist seed data for indexing...');
  for (i in sourceSeed) {
    try {
      let s = await Sources.findOne({ source: sourceSeed[i].source }).exec();
      if (!s) {
        let source = new Sources({
          source: sourceSeed[i].source,
          links: sourceSeed[i].links
        });
        await source.save();
        console.log(i + 'Imported ' + sourceSeed[i].source + ' to seed data');
      }
    } catch(err) {
      console.log(err);
    }
  }
};

const indexNews = async() => {
  await initialize();

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

// initialize();
// printSources();
indexNews();
