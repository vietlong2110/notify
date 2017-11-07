const Models = require('../database');
const elastic = require('elasticsearch');
const client = new elastic.Client({
    host: process.env.NODE_ENV === 'production' ? 'elasticsearch' : 'localhost:9200'
});
const DEFAULT_INDEX = "articles";
const DEFAULT_TYPE = "articles";

function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}


const indexingMongoToElastic = async (index = DEFAULT_INDEX, type = DEFAULT_TYPE) => {

    try {
        var payload = {
            "settings": {
                "number_of_shards": 1,
                "analysis": {
                    "analyzer": {
                        "vn_non_diacritic": {
                            "type": "vi_analyzer",
                            "filter": ["icu_folding"]
                        }

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

                        },
                        "suggest": {
                            "type": "completion",
                            "analyzer": "vi_analyzer",
                            "preserve_position_increments": false,
                            "preserve_separators": false,
                        },

                        "link": {
                            "type": "text",
                            "index": "not_analyzed"
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
        };
        var params = {
            "index": index,
            "body": payload
        }
        let resultCreate = await client.indices.create(params);
        console.log(resultCreate);
    } catch (err) {
        console.log(err);
    }
    let articles = await Models.Articles.find({}).exec();
    for (let i = 0; i < articles.length; i++) {
        try {
            let articleById = await client.get({
                index: index,
                type: type,
                id: articles[i]._id.toString()
            });
            if (articleById === null) {
                let result = await client.index({
                    index: index,
                    type: type,
                    id: articles[i]._id.toString(),
                    body: {
                        image: articles[i].image,
                        link: articles[i].link,
                        description: articles[i].description,
                        source: articles[i].source,
                        publishedDate: articles[i].publishedDate,
                        title: articles[i].title,
                        tags: articles[i].tags,
                        content: articles[i].content,
                        video: articles[i].video
                    }
                });

                console.log(result);
            }
        } catch (err) {
            console.log(err);
            console.log(articles[i]);
        }
    }
}
indexingMongoToElastic();


