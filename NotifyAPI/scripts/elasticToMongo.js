const elastic = require('elasticsearch');
const client = new elastic.Client({
  host: process.env.NODE_ENV === 'production' ? 'elasticsearch' : 'localhost:9200'
});

const { Feeds } = require('../database');

const storeElasticToMongo = async() => {
  const INDEX = 'websites';
  const TYPE = 'feed';

  for (let i = 1; i <= 100000; i++) {
    let id = '' + i;
    try {
      let data = await client.get({
        index: INDEX,
        type: TYPE,
        id
      });
      data = data._source;
      if (data.feeds.length > 0) {
        let newUrlFeeds = new Feeds({
          url: data.url,
          feeds: data.feeds
        });
        await newUrlFeeds.save();
        console.log(`Saved ${data.url} feeds`);
      }
    } catch(err) {
      console.log(err);
    }
  }
};

storeElasticToMongo();
