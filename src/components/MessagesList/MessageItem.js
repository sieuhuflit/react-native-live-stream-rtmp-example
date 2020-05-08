import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image } from 'react-native';
import styles from './styles';

const MessageItem = ({ data }) => {
  const { userName, message } = data;
  return (
    <View style={styles.chatItem}>
      <View>
        <Image source={require('../../assets/avatar_1.png')} style={styles.avatar} />
      </View>
      <View style={styles.messageItem}>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.content}>{message}</Text>
      </View>
    </View>
  );
};

MessageItem.propTypes = {
  data: PropTypes.shape({
    userName: PropTypes.string,
    message: PropTypes.string,
  }),
};
MessageItem.defaultProps = {
  data: {
    userName: '',
    message: '',
  },
};

export default MessageItem;
