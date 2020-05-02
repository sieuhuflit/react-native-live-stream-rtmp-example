import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import styles from './styles';
import MessageItem from './MessageItem';

export default class MessagesList extends Component {
  renderItem = ({ item }) => <MessageItem data={item} />;

  render() {
    const { messages } = this.props;
    return (
      <View style={styles.wrapListMessages}>
        <FlatList data={messages.reverse()} renderItem={this.renderItem} inverted />
      </View>
    );
  }
}

MessagesList.propTypes = {
  /* eslint-disable */
  messages: PropTypes.array,
};

MessagesList.defaultProps = {
  messages: [],
};
