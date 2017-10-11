import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SocialIcon } from 'react-native-elements';

class LoginScreen extends React.Component {
  render() {
    return(
      <View style={styles.container}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------
import { connect } from 'react-redux';

import { loginFacebook } from '../actions';

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(loginFacebook())
});

export default connect(null, mapDispatchToProps)(LoginScreen);
