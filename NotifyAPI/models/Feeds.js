const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
// const config = require('./mongoosastic');

const Feeds = new Schema({
  url: {
    type: String
  },
  feeds: [{
    type: String
  }]
});

// Feeds.plugin(mongoosastic, config.feeds);

module.exports = Feeds;
