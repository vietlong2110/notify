import React from 'react';
import styled from 'styled-components/native';
import { AppState } from 'react-native';
import {
  TabRouter,
  addNavigationHelpers,
  createNavigator,
  createNavigationContainer
} from 'react-navigation';
import { Ionicons, Entypo } from '@expo/vector-icons';

import NotifyScreen from './NotifyScreen';
import SaveScreen from './SaveScreen';

const DEFAULT_TAB_ICON_SIZE = 27;

const TabContainer = styled.View`
  paddingTop: 20;
  flexDirection: row;
  height: 64;
  border-radius: 2;
  border-color: #ddd;
  border-bottom-width: 2;
  shadowColor: #cfcfd1;
  shadowOffset: 0px 7px;
  shadowRadius: 7;
  shadowOpacity: 0.8;
`;

const TabLeft = styled.TouchableOpacity`
  flex: 1;
  alignItems: flex-start;
  justifyContent: center;
  paddingLeft: 10;
`;

const TabRight = styled.TouchableOpacity`
  flex: 1;
  alignItems: flex-end;
  justifyContent: center;
  paddingRight: 10;
`;

const TabView = styled.View`
  flex: 1;
  backgroundColor: white;
`;

const CustomTabBar = ({ navigation }) => {
  const { routes } = navigation.state;
  return (
    <TabContainer>
      <TabLeft>
        <Ionicons name="ios-settings" size={DEFAULT_TAB_ICON_SIZE} />
      </TabLeft>

      <TabRight onPress={() => navigation.navigate('Notify')}>
        <Ionicons name="ios-notifications" size={DEFAULT_TAB_ICON_SIZE} />
      </TabRight>

      <TabLeft onPress={() => navigation.navigate('Save')}>
        <Ionicons name="ios-bookmark" size={DEFAULT_TAB_ICON_SIZE} />
      </TabLeft>

      <TabRight>
        <Entypo name="plus" size={DEFAULT_TAB_ICON_SIZE} />
      </TabRight>
    </TabContainer>
  );
};

const CustomTabView = ({ router, navigation }) => {
  const { routes, index } = navigation.state;
  const ActiveScreen = router.getComponentForRouteName(routes[index].routeName);
  return (
    <TabView>
      <CustomTabBar navigation={navigation} />
      <ActiveScreen
        navigation={addNavigationHelpers({
          ...navigation,
          state: routes[index],
        })}
      />
    </TabView>
  );
};

const CustomTabRouter = TabRouter({
  Notify: {
    screen: NotifyScreen,
    path: 'notify'
  },
  Save: {
    screen: SaveScreen,
    path: 'save'
  }
}, {
  initialRouteName: 'Notify'
});

const CustomTab = createNavigationContainer(
  createNavigator(CustomTabRouter)(CustomTabView)
);

class TestScreen extends React.Component {
  loadEverything() {
    this.props.dispatch(loadUser(this.props.token));
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.loadEverything();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active')
      this.loadEverything();
  }

  render() {
    return <CustomTab />
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------
import { connect } from 'react-redux';

import { loadUser } from '../actions';

const select = state => ({
  token: state.user.data.token
});

export default connect(select)(TestScreen);