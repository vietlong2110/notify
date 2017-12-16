/*******************************************************************************
*           INDEXING EVERY ARTICLES OF THE APP HERE (NEWS OR SOCIAL)           *
*******************************************************************************/
// const Promise = require('bluebird');
// const fs = Promise.promisifyAll(require('fs'));

const { fetchNews } = require('./scraping/news');
const { Sources } = require('./database');
const elastic = require('elasticsearch');
const client = new elastic.Client({
  host: process.env.NODE_ENV === 'production' ? 'elasticsearch' : 'localhost:9200'
});
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

const mappingElastic = async() => {
  try {
    var payload = {
      "settings": {

        "number_of_shards": 1,
        "analysis": {
          "filter": {
            "shingles_filter": {
              "type": "shingle",
              "min_shingle_size": 2,
              "max_shingle_size": 3,
              "filler_token": ""
            }
          },
          "analyzer": {
            "vn_analysis": {
              "type": "custom",
              "tokenizer": "vi_tokenizer",
              "filter": ["icu_folding", "shingles_filter"]
            },
            "vn_query": {
              "type": "custom",
              "tokenizer": "standard",
              "filter": ["icu_folding", "shingles_filter"]
            }
          }
        }
      },

      "mappings": {
        "articles": {
          "properties": {
            "content": {
              "type": "text",
              "analyzer": "vn_analysis"
            },
            "title": {
              "type": "text",
              "analyzer": "vn_analysis"


            },
            "description": {
              "type": "text",
              "analyzer": "vn_analysis"

            },
            "tags": {
              "type": "text",
              "analyzer": "vn_analysis",
              "fields": {
                "raw": {
                  "type": "string",
                  "index": "not_analyzed"

                }
              }
            }
          }
        }

      }


    };
    var params = {
      "index": "articles",
      "body": payload
    }
    let resultCreate = await client.indices.create(params);
    console.log(resultCreate);
  }catch (e){
    console.log(e);
  }
}


const initialize = async() => {
  //come to make mapping
  await mappingElastic();

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
