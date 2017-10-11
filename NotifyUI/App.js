import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './src/store';
import AppComponents from './src/App';

const store = configureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppComponents />
      </Provider>
    );
  }
}
