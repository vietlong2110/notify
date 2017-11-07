import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import reducers from './reducers';

const logger = createLogger();

const configureStore = preloadedState => {
  const store = createStore(
    reducers,
    preloadedState,
    compose(applyMiddleware(thunk, logger), autoRehydrate())
  );
  persistStore(store, { storage: AsyncStorage });
  return store;
};

export default configureStore;
