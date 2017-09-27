const jwt = require('jwt-simple');

const config = require('../config');
const { Users } = require('../database');

const FAKE_EMAIL = 'abc@xyz';
const FAKE_PASSWORD = 'password';

const fakeUser = async() => {
  let newUser = new Users({
    email: FAKE_EMAIL,
    password: FAKE_PASSWORD
  });
  let user = await newUser.save();
  console.log('Created fake user with email = ' + user.email + ' and password = ' + user.password);
  console.log('Token for testing with this user is: JWT ' + jwt.encode({ id: user._id }, config.secret));
};

fakeUser();
