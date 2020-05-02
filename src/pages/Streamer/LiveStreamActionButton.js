import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import { LIVE_STATUS } from '../../utils/constants';
import styles from './styles';

const LiveStreamActionButton = ({ currentLiveStatus, onPress }) => {
  let backgroundColor = '#9b59b6';
  let text = 'Start live video';
  if (Number(currentLiveStatus) === Number(LIVE_STATUS.ON_LIVE)) {
    backgroundColor = '#e74c3c';
    text = 'Stop live stream';
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btnBeginLiveStream, { backgroundColor }]}>
      <Text style={styles.beginLiveStreamText}>{text}</Text>
    </TouchableOpacity>
  );
};

LiveStreamActionButton.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  currentLiveStatus: PropTypes.number,
  onPress: PropTypes.func,
};

LiveStreamActionButton.defaultProps = {
  navigation: {
    goBack: () => null,
  },
  currentLiveStatus: LIVE_STATUS.PREPARE,
  onPress: () => null,
};

export default LiveStreamActionButton;
