/*******************************************************************************
 *         SETUP FOR MONGODB AND ELASTICSEARCH (CONNECT BY MONGOOSASTIC)        *
 *******************************************************************************/

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Feeds, Sources, Articles, Users, Favorites, Keywords } = require('./models');

let hostname = process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'development' ? 'mongo' : 'localhost';

//connect to mongodb
let readyState = mongoose.connection.readyState;
if (readyState !== 1 || readyState !== 2)
  mongoose.connect(`mongodb://${hostname}/notify`, { useMongoClient: true });

let feeds = mongoose.model('Feed', Feeds);
let sources = mongoose.model('Source', Sources);
let users = mongoose.model('User', Users);
let keywords = mongoose.model('Keyword', Keywords);
let articles = mongoose.model('Articles', Articles);
let favorites = mongoose.model('Favorites', Favorites);

module.exports = {
  Feeds: feeds,
  Sources: sources,
  Articles: articles,
  Users: users,
  Favorites: favorites,
  Keywords: keywords
};
