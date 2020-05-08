import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, Text, SafeAreaView, Animated, Alert } from 'react-native';
import get from 'lodash/get';
import { NodePlayerView } from 'react-native-nodemediaclient';
import moment from 'moment';
import SocketManager from '../../socketManager';
import styles from './styles';
import FloatingHearts from '../../components/FloatingHearts';
import ChatInputGroup from '../../components/ChatInputGroup';
import MessagesList from '../../components/MessagesList/MessagesList';
import { LIVE_STATUS } from '../../utils/constants';
import { RTMP_SERVER } from '../../config';

export default class Viewer extends Component {
  constructor(props) {
    super(props);
    this.Animation = new Animated.Value(0);
    const { route } = props;
    const data = get(route, 'params.data');
    const roomName = get(data, 'roomName');
    const liveStatus = get(data, 'liveStatus', LIVE_STATUS.PREPARE);
    const userName = get(route, 'params.userName', '');
    this.state = {
      messages: [],
      countHeart: 0,
      isVisibleMessages: true,
      inputUrl: null,
    };
    this.roomName = roomName;
    this.userName = userName;
    this.liveStatus = liveStatus;
    this.timeout = null;
  }

  componentDidMount() {
    const { navigation } = this.props;
    /**
     * Just for replay
     */
    if (this.liveStatus === LIVE_STATUS.FINISH) {
      SocketManager.instance.emitReplay({
        userName: this.userName,
        roomName: this.roomName,
      });
      SocketManager.instance.listenReplay((data) => {
        const { beginAt, messages } = data;
        const start = moment(beginAt);
        for (let i = 0; i < messages.length; i += 1) {
          ((j, that) => {
            const end = moment(messages[j].createdAt);
            const duration = end.diff(start);
            setTimeout(() => {
              that.setState((prevState) => ({ messages: [...prevState.messages, messages[j]] }));
            }, duration);
          })(i, this);
        }
      });
      const inputUrl = `${RTMP_SERVER}/live/${this.roomName}/replayFor${this.userName}`;
      this.setState({ inputUrl });
    } else {
      this.setState({
        inputUrl: `${RTMP_SERVER}/live/${this.roomName}`,
        messages: this.messages,
      });
      SocketManager.instance.emitJoinRoom({
        userName: this.userName,
        roomName: this.roomName,
      });
      SocketManager.instance.listenSendHeart(() => {
        this.setState((prevState) => ({ countHeart: prevState.countHeart + 1 }));
      });
      SocketManager.instance.listenSendMessage((data) => {
        const messages = get(data, 'messages', []);
        this.setState({ messages });
      });
      SocketManager.instance.listenFinishLiveStream(() => {
        Alert.alert(
          'Alert ',
          'Thanks for watching this live stream',
          [
            {
              text: 'Okay',
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: false }
        );
      });
      this.startBackgroundAnimation();
    }
  }

  componentWillUnmount() {
    if (this.nodePlayerView) this.nodePlayerView.stop();
    SocketManager.instance.emitLeaveRoom({
      userName: this.userName,
      roomName: this.roomName,
    });
    this.setState({
      messages: [],
      countHeart: 0,
      isVisibleMessages: true,
      inputUrl: null,
    });
    clearTimeout(this.timeout);
  }

  startBackgroundAnimation = () => {
    this.Animation.setValue(0);
    Animated.timing(this.Animation, {
      toValue: 1,
      duration: 15000,
      useNativeDriver: false,
    }).start(() => {
      this.startBackgroundAnimation();
    });
  };

  onPressHeart = () => {
    SocketManager.instance.emitSendHeart({
      roomName: this.roomName,
    });
  };

  onPressSend = (message) => {
    SocketManager.instance.emitSendMessage({
      roomName: this.roomName,
      userName: this.userName,
      message,
    });
    this.setState({ isVisibleMessages: true });
  };

  onEndEditing = () => this.setState({ isVisibleMessages: true });

  onFocusChatGroup = () => {
    this.setState({ isVisibleMessages: false });
  };

  onPressClose = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  renderBackgroundColors = () => {
    const backgroundColor = this.Animation.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: ['#1abc9c', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#1abc9c'],
    });
    if (this.liveStatus === LIVE_STATUS.FINISH) return null;
    return (
      <Animated.View style={[styles.backgroundContainer, { backgroundColor }]}>
        <SafeAreaView style={styles.wrapperCenterTitle}>
          <Text style={styles.titleText}>
            Stay here and wait until start live stream you will get 30% discount
          </Text>
        </SafeAreaView>
      </Animated.View>
    );
  };

  renderNodePlayerView = () => {
    const { inputUrl } = this.state;
    if (!inputUrl) return null;
    return (
      <NodePlayerView
        style={styles.playerView}
        ref={(vb) => {
          this.nodePlayerView = vb;
        }}
        inputUrl={inputUrl}
        scaleMode="ScaleAspectFit"
        bufferTime={300}
        maxBufferTime={1000}
        autoplay
      />
    );
  };

  renderChatGroup = () => {
    return (
      <ChatInputGroup
        onPressHeart={this.onPressHeart}
        onPressSend={this.onPressSend}
        onFocus={this.onFocusChatGroup}
        onEndEditing={this.onEndEditing}
      />
    );
  };

  renderListMessages = () => {
    const { messages, isVisibleMessages } = this.state;
    if (!isVisibleMessages) return null;
    return <MessagesList messages={messages} />;
  };

  render() {
    const { countHeart } = this.state;
    /**
     * Replay mode
     */
    if (this.liveStatus === LIVE_STATUS.FINISH) {
      return (
        <View style={styles.blackContainer}>
          {this.renderNodePlayerView()}
          {this.renderListMessages()}
          <TouchableOpacity style={styles.btnClose} onPress={this.onPressClose}>
            <Image
              style={styles.icoClose}
              source={require('../../assets/close.png')}
              tintColor="white"
            />
          </TouchableOpacity>
          <FloatingHearts count={countHeart} />
        </View>
      );
    }
    /**
     * Viewer mode
     */
    return (
      <View style={styles.container}>
        {this.renderBackgroundColors()}
        {this.renderNodePlayerView()}
        {this.renderChatGroup()}
        {this.renderListMessages()}
        <TouchableOpacity style={styles.btnClose} onPress={this.onPressClose}>
          <Image
            style={styles.icoClose}
            source={require('../../assets/close.png')}
            tintColor="white"
          />
        </TouchableOpacity>
        <FloatingHearts count={countHeart} />
      </View>
    );
  }
}

Viewer.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  route: PropTypes.shape({}),
};

Viewer.defaultProps = {
  navigation: {
    goBack: () => null,
  },
  route: {},
};
