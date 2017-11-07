import React from 'react';
import styled from 'styled-components/native';
import { StackNavigator } from 'react-navigation';

import { LoginScreen, TestScreen } from './components';

const Container = styled.View`
  flex: 1;
`;

const rootNavigator = isAuthenticated => StackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  Test: {
    screen: TestScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
}, {
  initialRouteName: isAuthenticated ? 'Test' : 'Login'
});

class AppComponents extends React.Component {
  render() {
    const Layout = rootNavigator(this.props.isAuthenticated);
    return (
      <Container>
        <Layout />
      </Container>
    );
  }
};

//--------------------------------------------------------------------------------------------------------------------------------------
import { connect } from 'react-redux';

const select = state => ({
  isAuthenticated: state.user.isAuthenticated
});

export default connect(select)(AppComponents);
