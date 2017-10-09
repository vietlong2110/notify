const jwt = require('jwt-simple');
const express = require('express');
const router = express.Router();

const Controllers = require('../controllers');
const Models = require('../database');
const config = require('../config');

/*
	POST /fblogin
	body: {
		token: ...
	}
	response: {
		success: true/false,
		token: 'JWT...',
		email: ...,
		name: ...,
		profile_picture: ...,
		message: 'some err || null'
	}
*/
router.post('/fblogin', async (req, res) => {
  let access_token = req.body.token;

  try {
    let info = await Controllers.facebook.userInfo(access_token);
    const { email, name, profile_picture } = info;
    let user = await Models.Users.findOne({ email }).exec();

    if (!user) {
      let newUser = new Models.Users({
        email, name, profile_picture, access_token
      });
      await newUser.save();

      res.json({
        success: true,
        token: "JWT " + jwt.encode({ id: newUser._id }, config.secret),
        email, name, profile_picture
      });
    }
    else {
      user.access_token = access_token;
      await user.save();

      res.json({
        success: true,
        token: "JWT " + jwt.encode({ id: user._id }, config.secret),
        email, name, profile_picture
      });
    }
  } catch (err) {
    res.sendStatus(401).json({
      success: false,
      error: err
    });
  }
});

module.exports = router;
