const Models = require('../database')
const elastic = require('elasticsearch');
const extractor = require('../libs/extractor');
const client = new elastic.Client({
    host: process.env.NODE_ENV === 'production' ? 'elasticsearch' : 'localhost:9200'
});
const DEFAULT_INDEX = "articles";
const DEFAULT_TYPE = "articles";
const MAX_ARTICLES = 10000;
function comparePublshedDate(a, b) {
    return a.publishedDate - b.publishedDate;
}
const cleanArticleOld = async (index = DEFAULT_INDEX, type = DEFAULT_TYPE) => {
    try {
        let countAllDoc = await Models.Articles.count({}).exec();
        if (countAllDoc > MAX_ARTICLES) {
            let remainingDoc
            let oldArticles = await Models.Articles.find({}).select('_id publishedDate').lean().exec();
            oldArticles.sort(comparePublshedDate);
            for(let i=0; i< oldArticles.length/5; i++){
                try{
                    let resultDeleteFromMongoArticles = await Models.Articles.remove({'_id': oldArticles[i]._id}).exec();
                    let resultDeleteFromMongoFavorties = await Models.Favorites.remove({'article':oldArticles[i]._id}).exec();
                    let resultDeleteFromElastic = await client.delete({
                        index: index,
                        type: type,
                        id: oldArticles[i]._id.toString()
                    });
                    console.log("deleted document with id:"+ oldArticles[i]._id.toString());
                }catch (err){
                    console.log(err)
                }
            }

        }
    } catch (err) {
        console.log(err);
    }
};

cleanArticleOld()