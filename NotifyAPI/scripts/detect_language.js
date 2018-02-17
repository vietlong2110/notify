const Models = require('../database');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
const detect_language = (title) => {
    // console.log(title)
    result = lngDetector.detect(title)
    // console.log(result)
    if (result.length != 0) {
        // console.log(1)
        // console.log(result)
        for (var i = 0; i < result.length; i++) {
            language_with_prob = result[i]
            if (language_with_prob[0] == 'vietnamese') {
                return 1
            }
            if ( language_with_prob[0] == 'english') {
                return 0
            }
        }
        return -1
    }
    // console.log(2)
    // vie_score = result
}

// console.log(detect_language(""))
const create__documents = async () => {
    let k = 0
    let total = await Models.Articles.count({}) 
    console.log(total)
    let body = []   
    while (k < total) {
        let articles = await Models.Articles.find({}).limit(3000).skip(k).exec();
        for ( let i = 0; i < articles.length; i++) {
            if ( i > 6) {
                
                return 
            }
            // console.log(articles)
            console.log(articles[i].title)
            console.log(detect_language(articles[i].title))
        }
    }
}

create_documents()