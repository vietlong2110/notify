const mongoose = require('mongoose');
const mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));
const Schema = mongoose.Schema;
const config = require('./mongoosastic');

const Articles = new Schema({
  link: {
    type: String,
    es_indexed: true
  },
  title: {
    type: String,
    es_indexed: true,
    es_analyzer: 'vi_analyzer'
  },
  description: {
    type: String,
    es_indexed: true,
    es_analyzer: 'vi_analyzer'
  },
  image: {
    type: String,
    es_indexed: true
  },
  tags: [{
    type: String,
    es_indexed: true
  }],
  content: {
    type: String,
    es_indexed: true,
    es_analyzer: 'vi_analyzer'
  },
  source: {
    type: String,
    es_indexed: true
  },
  videos: [{
    type: String,
    // es_indexed: true
  }],
  lang: {
    type: String,
    es_indexed: true
  },
  publishedDate: {
    type: Date,
    default: Date.now,
    es_indexed: true
  }
});

Articles.plugin(mongoosastic, config.articles);

module.exports = Articles;
