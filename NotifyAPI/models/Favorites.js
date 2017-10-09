/*******************************************************************************
 *                            FAVORITES DATABASE SCHEMA                             *
 *******************************************************************************/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Favorites = new Schema({

    user_id: {type: Schema.ObjectId},
    article: {
        type: Schema.ObjectId,
        ref:'Articles'
    },
    saved_date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Favorites;
