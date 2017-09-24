const mongoose = require('mongoose');

const { Feeds, Sources, Articles } = require('./models');

let hostname = process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'development' ? 'mongo': 'localhost';

let readyState = mongoose.connection.readyState;
if (readyState !== 1 || readyState !== 2)
  mongoose.connect(`mongodb://${hostname}/notify`, { useMongoClient: true });

let feeds = mongoose.model('Feed', Feeds);
let sources = mongoose.model('Source', Sources);

let articles = mongoose.model('Articles', Articles);
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
        // "vn_shingles": {
        //   "type": "custom",
        //   "tokenizer": "standard",
        //   "filter":[
        //     "icu_folding",
        //     "shingles_filter"
        //   ]
        // }
      }
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
}, function(err, mapping) {
  if (err)
    console.log('error creating mapping (you can safely ignore this)');
});
articles.synchronize();

module.exports = {
  Feeds: feeds,
  Sources: sources,
  Articles: articles
};
