/*******************************************************************************
*                           API GATE (8080) FOR BACKEND                        *
*******************************************************************************/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

//parser body
app.use(
  bodyParser.urlencoded({ extended: true })
);
app.use(bodyParser.json());

//Intialize with auth token
passport.use(require('./controllers/auth'));
app.use(passport.initialize());

//prevent CORF
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Origin, Authorization, X-Requested-With'
  );
  next();
});

// const auth = require('./api/auth');
// app.use('/auth', auth);

const api = require('./api/api')(passport); //include api router file
app.use('/', api);

const tests = require('./api/tests'); //include testing api router file
app.use('/test', tests);

app.use(function(err, req, res, next) { //middleware catching 500 response
  res.status(err.status || 500).send({
    message: err.message,
    error: {}
  });
});

const port = process.env.PORT || 8080; //open 8080 gate

app.listen(port, function() { //connect to node server
  console.log('App is running on port ' + port);
});
