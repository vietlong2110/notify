import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './reducers';

const logger = createLogger();

const configureStore = preloadedState => createStore(
  reducers,
  preloadedState,
  applyMiddleware(thunkMiddleware, logger)
);

export default configureStore;
