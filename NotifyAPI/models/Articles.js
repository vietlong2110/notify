/*******************************************************************************
*                           ARTICLES DATABASE SCHEMA                           *
*******************************************************************************/

const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
const config = require('../config');

const Articles = new Schema({
  link: {
    type: String,
    es_indexed: true,
    required: true,
    unique: true
  },
  title: {
    type: String,
    es_indexed: true,
    es_analyzer: 'vi_analyzer',
    required: true
  },
  description: {
    type: String,
    es_indexed: true,
    es_analyzer: 'vi_analyzer',
    required: true
  },
  image: {
    type: String,
    es_indexed: true,
    required: true
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
    es_indexed: true,
    required: true
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
    es_indexed: true,
    required: true
  }
});

Articles.plugin(mongoosastic, config.articles);

module.exports = Articles;
