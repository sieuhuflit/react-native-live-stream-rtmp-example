import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import styles from './styles';

export default class ChatInputGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  onPressSend = () => {
    const { message } = this.state;
    const { onPressSend } = this.props;
    onPressSend(message);
    Keyboard.dismiss();
    this.setState({ message: '' });
  };

  onPressHeart = () => {
    const { onPressHeart } = this.props;
    onPressHeart();
  };

  onEndEditing = () => {
    Keyboard.dismiss();
    const { onEndEditing } = this.props;
    onEndEditing();
  };

  onFocus = () => {
    const { onFocus } = this.props;
    onFocus();
  };

  onChangeMessageText = (text) => [this.setState({ message: text })];

  renderContent() {
    const { message } = this.state;
    return (
      <View style={styles.row}>
        <TextInput
          style={styles.textInput}
          placeholder="Comment input"
          underlineColorAndroid="transparent"
          onChangeText={this.onChangeMessageText}
          value={message}
          autoCapitalize="none"
          autoCorrect={false}
          onEndEditing={this.onEndEditing}
          onFocus={this.onFocus}
        />
        <TouchableOpacity
          style={styles.wrapIconSend}
          onPress={this.onPressSend}
          activeOpacity={0.6}
        >
          <Image source={require('../../assets/ico_send.png')} style={styles.iconSend} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wrapIconHeart}
          onPress={this.onPressHeart}
          activeOpacity={0.6}
        >
          <Image source={require('../../assets/ico_heart.png')} style={styles.iconHeart} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (Platform.OS === 'android') {
      return <SafeAreaView style={styles.wrapper}>{this.renderContent()}</SafeAreaView>;
    }
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.flex1}>
          <KeyboardAccessory backgroundColor="transparent">
            {this.renderContent()}
          </KeyboardAccessory>
        </View>
      </SafeAreaView>
    );
  }
}

ChatInputGroup.propTypes = {
  onPressHeart: PropTypes.func,
  onPressSend: PropTypes.func,
  onFocus: PropTypes.func,
  onEndEditing: PropTypes.func,
};

ChatInputGroup.defaultProps = {
  onPressHeart: () => null,
  onPressSend: () => null,
  onFocus: () => null,
  onEndEditing: () => null,
};
