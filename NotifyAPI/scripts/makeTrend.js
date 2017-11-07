const Models = require('../database');
const elastic = require('elasticsearch');
const client = new elastic.Client({
    host: process.env.NODE_ENV === 'production' ? 'elasticsearch' : 'localhost:9200'
});
const DEFAULT_INDEX = "articles";
const DEFAULT_TYPE = "articles";
const DEFAULT_DAY = 3;

const findTrendingInRecent = async (index = DEFAULT_INDEX, type = DEFAULT_TYPE) => {
    let now = new Date(Date.now());
    let affterDay = new Date(now.getTime() - 86400 * 1000*DEFAULT_DAY);
    let listArticle = await Models.Articles.find({
        publishedDate:{
            $gte: affterDay.toISOString(),
            $lt: now.toISOString()
        }

    }).exec();
    var listEntity = [];
    for(let i =0; i< listArticle.length; i++){
        var analyzeResults = [];
        try {
            try {
                let text = listArticle[i].title + " " + listArticle[i].description + " " + listArticle[i].content;
                analyzeResults = await client.indices.analyze({
                    index: index,
                    body: {
                        analyzer: 'vi_analyzer',
                        text: text.toString()
                    }
                });
            }catch (errAnalyze){
                console.log(errAnalyze);
                let text = listArticle[i].title + " " + listArticle[i].description;
                analyzeResults = await client.indices.analyze({
                    index: index,
                    body: {
                        analyzer: 'vi_analyzer',
                        text: text.toString()
                    }
                });
            }

            for (let j = 0; j < analyzeResults.tokens.length; j++) {
                if( (analyzeResults.tokens[j].type === "name2" || analyzeResults.tokens[j].type === "entity2")&&(listEntity.indexOf(analyzeResults['tokens'][j]['token'])===-1)) {
                    listEntity.push(analyzeResults.tokens[j].token);
                    console.log(analyzeResults.tokens[j].token);
                }
            }
        }catch (err){
            console.log(err);
            console.log(listArticle[i]);
        }

    }
    console.log("ending");

};

findTrendingInRecent();