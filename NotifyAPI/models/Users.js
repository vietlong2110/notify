/*******************************************************************************
*                            USERS DATABASE SCHEMA                             *
*******************************************************************************/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    name: String,
    email: String,
    password: String,
    access_token: String,
    profile_picture: String,
    //roles: Array,
    locales: String,
    keyword_list: [String],
    //categories_liked: Array,
    user_liked: [{
      id: String,
      name: String,
      website: String,
      category: String
    }],
    notify_list: [{type: Schema.ObjectId, ref:'Articles', unique: true}]
});

module.exports = Users;
