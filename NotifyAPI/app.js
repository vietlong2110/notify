const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(
  bodyParser.urlencoded({ extended: true })
);
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Origin, Authorization, X-Requested-With'
  );
  next();
});

const api = require('./api/api');
app.use('/', api);

const tests = require('./api/tests');
app.use('/test', tests);

app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({
    message: err.message,
    error: {}
  });
});

const port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log('App is running on port ' + port);
});
