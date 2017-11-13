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
                    "filter": {
                        "shingles_filter": {
                            "type": "shingle",
                            "min_shingle_size": 2,
                            "max_shingle_size": 3,
                            "output_unigrams": false
                        }
                    },
                    "analyzer": {
                        "vn_analysis": {
                            "type": "custom",
                            "tokenizer": "vi_tokenizer",
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
                            "analyzer": "vn_analysis",
                            "fielddata": true

                        },
                        "title": {
                            "type": "text",
                            "analyzer": "vn_analysis",
                            "fielddata": true


                        },
                        "description": {
                            "type": "text",
                            "analyzer": "vn_analysis",
                            "fielddata": true

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
            let articleById = await client.exists({
                index: index,
                type: type,
                id: articles[i]._id.toString()
            });
            //make tags
            if (articleById === false) {

                var analyzeResults;
                try {
                    let text = articles[i].title + " " + articles[i].description + " " + articles[i].content;
                    analyzeResults = await client.indices.analyze({
                        index: index,
                        body: {
                            analyzer: 'vi_analyzer',
                            text: text.toString()
                        }
                    });
                } catch (errAnalyze) {
                    console.log(errAnalyze);
                    let text = articles[i].title + " " + articles[i].description;
                    analyzeResults = await client.indices.analyze({
                        index: index,
                        body: {
                            analyzer: 'vi_analyzer',
                            text: text.toString()
                        }
                    });
                }
                for (let j = 0; j < analyzeResults.tokens.length; j++) {
                    if ((analyzeResults.tokens[j].type === "name2") && (articles[i].tags.indexOf(analyzeResults['tokens'][j]['token']) === -1)) {
                        articles[i].tags.push(analyzeResults.tokens[j].token);
                        console.log(analyzeResults.tokens[j].token);
                    }
                }

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


