/*******************************************************************************
*                             BACKEND CONFIGURATION                            *
*******************************************************************************/

let hostname = process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'development' ? 'elasticsearch:9200' : 'localhost:9200';

module.exports = {
  articles: {
    hosts: [hostname],
    index: 'articles',
    bulk: {
      size: 10, // preferred number of docs to bulk index
      delay: 100 //milliseconds to wait for enough docs to meet size constraint
    }
  },
  secret: '@illuminati@'
};
