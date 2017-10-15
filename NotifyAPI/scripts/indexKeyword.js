const Models = require('../database')
const elastic = require('elasticsearch');
const extractor = require('../libs/extractor');
const client = new elastic.Client({
    host: process.env.NODE_ENV === 'production' ? 'elasticsearch' : 'localhost:9200'
});

const DEFAULT_INDEX = "zing";
const DEFAULT_TYPE = "articles";

const indexKeywordCompetion = async () => {
    try {
        let keywords = await Models.Keywords.find({}).exec();
        for (let i = 0; i < keywords.length; i++) {
            let result = await client.putScript({

            })
        }
    } catch (err) {
        console.log(err);
    }
};