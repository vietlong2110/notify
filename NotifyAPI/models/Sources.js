/*******************************************************************************
*                           SOURCES DATABASE SCHEMA                            *
*******************************************************************************/

const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
// const config = require('./mongoosastic');

const Sources = new Schema({
  source: String, //website
  links: [String], //list of rss
  lang: String
});

// Sources.plugin(mongoosastic, config.sources);

module.exports = Sources;
