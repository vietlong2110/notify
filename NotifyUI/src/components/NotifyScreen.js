import React from 'react';
import styled from 'styled-components/native';
import { Alert } from 'react-native';

import { FeedCard } from './FeedCard';

const Container = styled.View`
  flex: 1;
  backgroundColor: #fff;
  alignItems: center;
  justifyContent: center;
`;

const Button = styled.Button``;

const Text = styled.Text``;

class NotifyScreen extends React.Component {
  onAlert(message) {
    Alert.alert('Sign out', message, [{
      text: 'Cancel',
      onPress: () => this.props.dispatch(endAlert())
    }, {
      text: 'Ok',
      onPress: () => {
        this.props.dispatch(endAlert());
        this.props.dispatch(logout());
        this.props.navigation.navigate('Login', {});
      }
    }]);
  }

  render() {
    const { data, message } = this.props;
    return (
      <Container>
        <FeedCard />
        {/* <Text>{data.email}</Text>
        <Button
          title='Sign Out'
          onPress={ () => this.props.dispatch(messageAlert('Are you sure you want to log out?')) }
        /> */}
        {
          // message && this.onAlert(message)
        }
      </Container>
    );
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------
import { connect } from 'react-redux';

import { messageAlert, endAlert, logout } from '../actions';

const select = state => ({
  data: state.user.data,
  message: state.alert.message
});

export default connect(select)(NotifyScreen);
