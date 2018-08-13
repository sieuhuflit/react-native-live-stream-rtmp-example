import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

/**
 * @class HeartShape
 */

const HeartShape = ({ color }) => {
  return (
    <Image
      source={require('../assets/ico_heart.png')}
      style={{
        tintColor: color,
        width: 42,
        height: 42
      }}
    />
  );
};

HeartShape.propTypes = {
  color: PropTypes.string
};

HeartShape.defaultProps = {
  // color: 'red'
};

/**
 * Exports
 */

export default HeartShape;
