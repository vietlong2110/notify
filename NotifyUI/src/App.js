import React from 'react';
import { View, Button, ActivityIndicator, StyleSheet } from 'react-native';
// import { Button } from 'react-native-elements';
import { StackNavigator, TabNavigator } from 'react-navigation';

import { LoginScreen, TestScreen, NotifyScreen, SaveScreen } from './components';

const TabComponents = TabNavigator({
  Notify: { screen: NotifyScreen },
  Save: { screen: SaveScreen }
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true
});

const SettingsComponents = () => (
  <Button title='Settings'/>
);

const AddComponents = () => (
  <Button title='Add' />
);

const rootNavigator = isAuthenticated => StackNavigator({
  Login: { screen: LoginScreen },
  Main: {
    screen: TabComponents
  },
  Test: { screen: TestScreen }
}, {
  mode: 'modal',
  initialRouteName: isAuthenticated ? 'Test' : 'Login'
});

class AppComponents extends React.Component {
  componentWillMount() {
    this.props.setAuthLayout()
  }

  render() {
    const Layout = rootNavigator(this.props.isAuthenticated);
    return (
      <View style={styles.container}>
        {this.props.isPending ? <ActivityIndicator size='large' /> : <Layout />}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------
import { connect } from 'react-redux';

import { checkAuth } from './actions';

const mapStateToProps = state => {
  const { isAuthenticated, isPending } = state.authenticated;
  return { isAuthenticated, isPending };
};

const mapDispatchToProps = dispatch => ({
  setAuthLayout: () => dispatch(checkAuth())
});

export default connect(mapStateToProps, mapDispatchToProps)(AppComponents);
