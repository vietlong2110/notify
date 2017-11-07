/*******************************************************************************
 *         SETUP FOR MONGODB AND ELASTICSEARCH (CONNECT BY MONGOOSASTIC)        *
 *******************************************************************************/

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Feeds, Sources, Articles, Users, Favorites, Keywords } = require('./models');

let hostname = process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'development' ? 'mongo' : 'localhost';

//connect to mongodb
let readyState = mongoose.connection.readyState;
if (readyState !== 1 || readyState !== 2)
  mongoose.connect(`mongodb://${hostname}/notify`, { useMongoClient: true });

let feeds = mongoose.model('Feed', Feeds);
let sources = mongoose.model('Source', Sources);
let users = mongoose.model('User', Users);
let keywords = mongoose.model('Keyword', Keywords);
let articles = mongoose.model('Articles', Articles);
let favorites = mongoose.model('Favorites', Favorites);
//mapping types of articles index in elasticsearch
articles.createMapping({
  "settings": {
    "number_of_shards": 1,
    "analysis": {
      // "filter": {
      //   "shingles_filter": {
      //     "type": "shingle",
      //     "min_shingle_size": 2,
      //     "max_shingle_size": 3,
      //     "output_unigrams": false
      //   }
      // },
      "analyzer": {
        "vn_non_diacritic": {
          "type": "vi_analyzer",
          "filter": ["icu_folding"]
        }
      },
      "mappings": {
        "articles": {
          "_all": {
            "enabled": false
          },
          "_source": {
            "excludes": [
              "content"
            ]
          },
          "properties": {
            "content": {
              "type": "text",
              "analyzer": "vi_analyzer"
              // "fields": {
              //   "non_diacritic": {
              //     "type": "text",
              //     "analyzer": "vn_non_diacritic"
              //   },
              //   "raw": {
              //     "type": "text",
              //     "boost": 3,
              //     "analyzer": "vi_analyzer"
              //   }
              // }
            },
            // "title": {
            //   "type": "text",
            //   "analyzer": "vn_shingles",
            //   "fields": {
            //     "non_diacritic": {
            //       "type": "text",
            //       "analyzer": "vn_non_diacritic"
            //     },
            //     "raw": {
            //       "type": "text",
            //       "boost": 3,
            //       "analyzer": "vn_raw"
            //     }
            //   }
            // },
            // "description": {
            //   "type": "text",
            //   "analyzer": "vn_shingles",
            //   "fields": {
            //     "non_diacritic": {
            //       "type": "text",
            //       "analyzer": "vn_non_diacritic"
            //     },
            //     "raw": {
            //       "type": "text",
            //       "boost": 3,
            //       "analyzer": "vn_raw"
            //     }
            //   }
            // },
            "suggest": {
              "type": "completion",
              "analyzer": "vi_analyzer",
              "preserve_position_increments": false,
              "preserve_separators": false,
              "payloads": true
            },
            "link": {
              "type": "text",
              "index": "no"
            },
            "image": {
              "type": "text",
              "index": "no"
            },
            "lang": {
              "type": "text",
              "index": "no"
            }
          }
        }
      }
    }
  }
}, function(err, mapping) {
  if (err)
    console.log('error creating mapping (you can safely ignore this)');
});

module.exports = {
  Feeds: feeds,
  Sources: sources,
  Articles: articles,
  Users: users,
  Favorites: favorites,
  Keywords: keywords
};
