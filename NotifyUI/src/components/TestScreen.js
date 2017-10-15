import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Button } from 'react-native';

class TestScreen extends React.Component {
  render() {
    const { isPending, error, data } = this.props;
    return(
      <View style={styles.container}>
        {isPending && <ActivityIndicator size='large' />}
        {!isPending && !error && data && <Text>{data.email}</Text>}
        {!isPending && error && <Text>{error}</Text>}
        <Button
          title='Sign Out'
          onPress={async() => {
            try {
              await this.props.logout();
              this.props.navigation.navigate('Login', {});
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
    alignItems: 'center',
    justifyContent: 'center'
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------
import { connect } from 'react-redux';

import { logout } from '../actions';

const mapStateToProps = state => {
  const { data, isPending, error } = state.authenticated;
  return { data, isPending, error };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(TestScreen);
