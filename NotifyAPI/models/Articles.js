/*******************************************************************************
*                           ARTICLES DATABASE SCHEMA                           *
*******************************************************************************/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');

const Articles = new Schema({
  link: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  videos: [{
    type: String
  }],
  lang: {
    type: String
  },
  publishedDate: {
    type: Date,
    default: Date.now,
    required: true
  }

});

module.exports = Articles;
