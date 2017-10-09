/*******************************************************************************
 *                             INDEX CONTROLLERS                                *
 *******************************************************************************/

const facebook = require('./facebook');
const search = require('./search');
const user = require('./user')
const favorite = require('./favorite')
module.exports = {
    facebook,
    search,
    user,
    favorite
};
