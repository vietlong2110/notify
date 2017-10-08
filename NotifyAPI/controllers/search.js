/*******************************************************************************
 *                 CONTROLLER FUNCTIONS RELATING TO SEARCH                      *
 *******************************************************************************/

const elastic = require('elasticsearch');
const client = new elastic.Client({
    host: 'localhost:9200'
});

const DEFAULT_SIZE = 20; //return 20 articles by default

/**
 * Get articles by keyword query
 * @param {String} query
 * @param {Number} size - number of returning articles
 * @return {Promise<Array>}
 */
const searchArticles = async (query, size = DEFAULT_SIZE) => {
    let articleList = [];
    // if (query.match(/^[.\p{L}]*$/i)) {
    try {
        let results = await client.search({
            index: 'articles',
            size,
            body: {
                query: {
                    multi_match: {
                        query,
                        type: 'cross_fields',
                        fields: ['title^10', 'description^5', 'content'],
                        analyzer: 'vi_analyzer',
                        minimum_should_match: '67%'
                    }
                }
            }
        });


        for (let i=0; i< results.hits.hits.length;i++) {
            //results.hits.hits[i]._source.link;
            var article = {
                _id: results.hits.hits[i]._id,
                title: results.hits.hits[i]._source.title,
                image: results.hits.hits[i]._source.image,
                source: results.hits.hits[i]._source.source,
            }
            articleList = articleList.concat(article);

        }

        // console.log(articleList);
        return Promise.resolve(articleList);
    } catch (err) {
        return Promise.reject(err);
    }
    // }

    // query = query.replace(/[ ]{2,}/g, ' ');
    // if (query.split(' ').length < 2) {
    //   try {
    //     let results = await client.search({
    //       index: 'articles',
    //       size,
    //       body: {
    //         query: {
    //           bool: {
    //             must: {
    //               match: {
    //                 'content.non_diacritic': {
    //                   query,
    //                   analyzer: 'vn_non_diacritic'
    //                 }
    //               }
    //             },
    //             should: {
    //               match: {
    //                 'content.raw': {
    //                   query,
    //                   boost: 3,
    //                   analyzer: 'vn_raw'
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     });
    //     for (i in results.hits.hits)
    //       links = links.concat(results.hits.hits[i]._source.link);
    //     return Promise.resolve(links);
    //   } catch(err) {
    //     return Promise.reject(err);
    //   }
    // }
    // try {
    //   let results = await client.search({
    //     index: 'articles',
    //     size,
    //     body: {
    //       query: {
    //         bool: {
    //           must: {
    //             multi_match: {
    //               query,
    //               type: 'cross_fields',
    //               fields: ['title^10', 'description^5', 'content'],
    //               analyzer: 'vn_shingles',
    //               minimum_should_match: '67%'
    //             }
    //           },
    //           should: [{
    //             match: {
    //               'content.non_diacritic': {
    //                 query,
    //                 analyzer: 'vn_non_diacritic'
    //               }
    //             }
    //           }, {
    //             match: {
    //               'content.raw': {
    //                 query,
    //                 boost: 3,
    //                 analyzer: 'vi_analyzer'
    //               }
    //             }
    //           }, {
    //             match_phrase: { tags: query }
    //           }]
    //         }
    //       }
    //     }
    //   });
    //   for (i in results.hits.hits)
    //     links = links.concat(results.hits.hits[i]._source.link);
    //   // console.log(links);
    //   return Promise.resolve(links);
    // } catch(err) {
    //   return Promise.reject(err);
    // }
};

module.exports = {
    searchArticles
};
