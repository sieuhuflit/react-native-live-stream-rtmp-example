import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      size: new Animated.Value(100)
    };
  }

  componentWillMount() {
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener(value => (this._val = value));
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: () => {
        this.changeBlockSize(82);
      },
      onPanResponderMove: (e, gesture) =>
        Animated.event([
          { dx: this.state.pan.x, dy: this.state.pan.y, useNativeDriver: true }
        ])(gesture),
      onPanResponderRelease: (e, gesture) => {
        this.changeBlockSize(100);
        this.slideToStop(gesture);
      }
    });
    this.state.pan.setValue({ x: 0, y: 0 });
  }

  slideFinished() {
    let { dropZoneCoordinates } = this.props;
    this.animatedView._component.measure((fx, fy, width, height, sx, sy) => {
      sy >
      SCREEN_HEIGHT -
        dropZoneCoordinates.keyboardHeight -
        dropZoneCoordinates.height -
        dropZoneCoordinates.y
        ? this.addToCart()
        : this.backToStart();
    });
  }

  addToCart() {
    this.teleport();
    this.props.onFinishDragProduct();
  }

  removeFromCart() {
    this.backToStart();
  }

  slideToStop({ vx, vy }) {
    Animated.decay(this.state.pan, {
      velocity: { x: vx, y: vy },
      deceleration: 0.98
    }).start(() => this.slideFinished());
  }
  changeBlockSize(value) {
    Animated.timing(this.state.size, {
      duration: 200,
      toValue: value
    }).start();
  }

  backToStart() {
    Animated.spring(this.state.pan, {
      speed: 25,
      toValue: 0
    }).start();
  }

  teleport() {
    Animated.sequence([
      Animated.timing(this.state.size, {
        toValue: 0,
        duration: 200
      }),
      Animated.timing(this.state.pan, {
        toValue: 0,
        duration: 0
      }),
      Animated.timing(this.state.size, {
        toValue: 100,
        duration: 200
      })
    ]).start();
  }

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
      width: this.state.size,
      height: this.state.size
    };
    return (
      <Animated.Image
        {...this.panResponder.panHandlers}
        ref={ref => (this.animatedView = ref)}
        style={[panStyle, styles.circle]}
        source={{ uri: this.props.imageUrl }}
      />
    );
  }
}

let styles = StyleSheet.create({
  circle: {
    backgroundColor: 'skyblue',
    borderRadius: 5
  }
});
