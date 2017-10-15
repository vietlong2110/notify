/*******************************************************************************
 *                           KEYWORDS DATABASE SCHEMA                           *
 *******************************************************************************/

const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

const Keywords = new Schema({
    keyword: String,
    frequencyOnDoc: Number,
    frequencyAll: Number,
    tf: Number,
    idf: Number,
    score: Number
});

module.exports = Keywords;