/*******************************************************************************
*                   TESTING API ROUTER IN THIS FILE                            *
*******************************************************************************/

const express = require('express');
const app = express();
const router = express.Router();

const Controllers = require('../controllers');

router.get('/fblikes', async(req, res) => {
  // const access_token = req.query.access_token;
  try {
    let data = await Controllers.facebook.getUserLikePages(/*access_token*/);
    res.json({
      success: true,
      data
    })
  } catch(err) {
    res.json({
      success: false,
      error: err
    })
  }
});

module.exports = router;
