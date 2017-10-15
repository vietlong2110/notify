const Models = require('../database')
const elastic = require('elasticsearch');
const extractor = require('../libs/extractor');
const client = new elastic.Client({
    host: process.env.NODE_ENV === 'production' ? 'elasticsearch' : 'localhost:9200'
});

const DEFAULT_INDEX = "articles";
const DEFAULT_TYPE = "articles";
const DEFAULT_LENGTH = 200;

function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

const countFrequency = async (str, keyword) => {
    var count = 0;
    var pos = str.indexOf(keyword);

    while (pos !== -1) {
        count++;
        pos = str.indexOf(keyword, pos + 1);
    }
    return Promise.resolve(count);
}


const splitStringToArray = async (str) => {
    var stringArray = [];
    if (str.length > DEFAULT_LENGTH) {
        var pivot = str.length / DEFAULT_LENGTH;
        for (let i = 0; i <= pivot; i++) {
            stringArray.push(str.slice(i * DEFAULT_LENGTH, (i + 1) * DEFAULT_LENGTH))
        }
    } else {
        stringArray.push(str);
    }
    return Promise.resolve(stringArray);

};
const makeKeywordSchema = async (str, results) => {
    try {
        for (var i = 0; i < results.tokens.length; i++) {
            let frequency = await countFrequency(str.toLowerCase(), results.tokens[i].token);
            let result = await Models.Keywords.findOne({'keyword': results.tokens[i].token}).exec();
            if (result !== null) {
                result.frequencyAll += frequency;
                result.frequencyOnDoc += 1;
                await result.save();

                return Promise.resolve(result);
            } else {
                let keyword = Models.Keywords({
                    keyword: results.tokens[i].token,
                    frequencyOnDoc: 1,
                    frequencyAll: frequency,
                    tf: 0,
                    idf: 0,
                });
                await keyword.save();
                return Promise.resolve(keyword);

            }
        }
    } catch (err) {
        console.log(err);
    }

}

const makeKeyword = async (index = DEFAULT_INDEX, type = DEFAULT_TYPE) => {
    let articles = await Models.Articles.find({}).lean().exec();
    for (let i = 0; i < articles.length; i++) {
        try {
            var text = articles[i].content.replace(/\n/g, "");
            /*  var arr = await splitStringToArray(text);
              for (var j=0; j<arr.length; j++){
                  let results = await client.indices.analyze({
                      index: index,
                      body: {
                          analyzer: 'vi_analyzer',
                          text: arr[j]
                      }
                  });
                  await sleep(1000);
                  console.log(results);
              }*/
            let results = await client.indices.analyze({
                index: index,
                body: {
                    analyzer: 'vi_analyzer',
                    text: text.toString()
                }
            });
            console.log(results);
            await makeKeywordSchema(text, results);
        } catch (err) {
            console.log(err);
        }
    }

};

const calculateTfIdf = async () => {
    let countDoc = await Models.Articles.count({}).exec();
    let keywords = await Models.Keywords.find({}).exec();
    for (let i = 0; i < keywords.length; i++) {
        let keyword = keywords[i];
        keyword.tf = Math.sqrt(keyword.frequencyAll);
        keyword.idf = 1 + Math.log2(countDoc/(keyword.frequencyOnDoc+1));
        keyword.score = 1 + Math.log2(keyword.tf*keyword.idf);
        keyword.save();
    }
}


const main = async () => {
    //await  makeKeyword();
    await  calculateTfIdf();

}

main();