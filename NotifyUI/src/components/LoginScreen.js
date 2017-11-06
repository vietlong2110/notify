import React from 'react';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
import { SocialIcon } from 'react-native-elements';

const Container = styled.View`
  flex: 1;
  backgroundColor: #fff;
  justifyContent: center;
`;

class LoginScreen extends React.Component {
  onAlert() {
    Alert.alert('error', this.props.error, [{
      text: 'OK',
      onPress: () => this.props.endAlert()
    }]);
  }

  render() {
    return(
      <Container>
        <SocialIcon
          title='Sign In With Facebook'
          button
          type='facebook'
          onPress={async() => {
            try {
              await this.props.login();
              this.props.navigation.navigate('Test', {});
            } catch(err) {
            }
          }}
        />
        {
          // this.props.error && this.onAlert()
        }
      </Container>
    );
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------
import { connect } from 'react-redux';

import { loginFacebook, endAlert } from '../actions';

const select = state => ({
  error: state.alert.error
});

const action = dispatch => ({
  login: () => dispatch(loginFacebook()),
  endAlert: () => dispatch(endAlert())
});

export default connect(select, action)(LoginScreen);
