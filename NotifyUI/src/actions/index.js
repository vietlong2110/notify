import auth from './auth';
import alert from './alert';
import parse from './parse';

module.exports = {
  ...auth,
  ...alert,
  ...parse
};
