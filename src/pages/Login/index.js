import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import styles from './styles';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: 'Test2',
    };
  }

  onPressLogin = () => {
    const { userName } = this.state;
    if (userName === '') return Alert.alert('Please input userName');
    const {
      navigation: { navigate },
    } = this.props;
    return navigate('Home', { userName });
  };

  onChangeUserName = (userName) => this.setState({ userName });

  render() {
    const { userName } = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Please type any name"
          placeholderTextColor="gray"
          value={userName}
          onChangeText={this.onChangeUserName}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.loginBtn} onPress={this.onPressLogin}>
          <Text style={styles.textButton}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Login;
