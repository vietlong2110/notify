/*******************************************************************************
*                     WRITE API ROUTER IN THIS FILE                            *
*******************************************************************************/

const express = require("express");
const router = express.Router();

//Controller and Model to use
const Controllers = require('../controllers');
const Models = require('../database');

/**
* Search API
* @param {req} REQUEST QUERY FORMAT: ?q=...&size=
* @param {res} RESPONSE
* JSON FORMAT:
{
  success: Bool,
  payload: Array<Object> || null,
  error: Array<Object> || null
}
*/
router.get('/search', (req, res) => {

});

module.exports = router;
