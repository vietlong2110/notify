const Models = require('../database');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
const DEFAULT_INDEX = "articles";
const DEFAULT_TYPE = "articles";

const removeSymbols = body => {
    let s = body.toString();
    s = s.replace(/[\n\r]+/g, ' ');
    s = s.replace(/[\*\^\+\?\\\.\[\]\^\$\|\{\)\(\}\'\"\~!\/@£$%&=`´“”‘’;><:,]+/g, '');
    s = s.replace(/\s\s+/g, ' ');
    // console.log(s);
    return s;
};

const detect_language = (title) => {
    //return
    //1: eng
    //0: vie
    //-1: undefined

    result = lngDetector.detect(title)
    if (result.length != 0) {
        for (var i = 0; i < result.length; i++) {
            language_with_prob = result[i]
            if (language_with_prob[0] == 'vietnamese') {
                return 0
            }
            if (language_with_prob[0] == 'english') {
                return 1
            }
        }
        return -1
    }
}

const create_documents = async (index = DEFAULT_INDEX, type = DEFAULT_TYPE) => {
    //return body: an array of articles
    let k = 0
    let total = await Models.Articles.count({})
    console.log(total)
    let body = []
    while (k < total) {
        let articles = await Models.Articles.find({}).limit(3000).skip(k).exec();
        k += 3000
        for (let i = 0; i < articles.length; i++) {
            let description = removeSymbols(articles[i].description)
            let title = removeSymbols(articles[i].title)
            let content = removeSymbols(articles[i].content)
            let article = {}
            if (detect_language(title) == 1) {
                article = {
                    index: index,
                    type: type,
                    id: articles[i]._id.toString(),
                    body_eng: {
                        image: articles[i].image,
                        link: articles[i].link,
                        description, 
                        title, 
                        content,
                        source: articles[i].source,
                        publishedDate: articles[i].publishedDate,
                        tags: articles[i].tags,
                        video: articles[i].video
                    },
                    body_vi: {
                        image: null,
                        link: null,
                        description: null,
                        title: null,
                        content: null,
                        source: null,
                        publishedDate: null,
                        tags: null,
                        video: null
                    }
                }
            } else if (detect_language(title) == 0) {
                article = {
                    index: index,
                    type: type,
                    id: articles[i]._id.toString(),
                    body_vi: {
                        image: articles[i].image,
                        link: articles[i].link,
                        description, title, content,
                        source: articles[i].source,
                        publishedDate: articles[i].publishedDate,
                        tags: articles[i].tags,
                        video: articles[i].video
                    },
                    body_eng: {
                        image: null,
                        link: null,
                        description: null,
                        title: null,
                        content: null,
                        source: null,
                        publishedDate: null,
                        tags: null,
                        video: null
                    }
                }
            }
            body.push(article)
        }
        console.log(k)
    }
    return body
}
create_documents().then( v => console.log("body" +v))