const Models = require('../database');
const elastic = require('elasticsearch');
const client = new elastic.Client({
    host: process.env.NODE_ENV === 'production' ? 'elasticsearch' : 'localhost:9200'
});
const DEFAULT_INDEX = "articles";
const DEFAULT_TYPE = "articles";

const indexingMongoToElastic = async (index = DEFAULT_INDEX, type = DEFAULT_TYPE) => {

        let articles = await Models.Articles.find({}).lean().exec();

        for (let i = 0; i < articles.length; i++) {
            try {

                let result = await client.create({
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
            }catch (err){
                console.log(err);
            }
        }
}
indexingMongoToElastic("zing","articles");