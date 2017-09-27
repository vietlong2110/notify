const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { Users } = require('../database');
const config = require('../config');

module.exports = new Strategy(
  {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
  },
  function(jwt_payload, done) {
    Users.findById(jwt_payload.id).exec()
    .then(user => {
      if (user)
        done(null, user);
      else done(null, false);
    })
    .catch(err => done(null, false));
  }
);
