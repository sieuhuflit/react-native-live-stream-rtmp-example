import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import get from 'lodash/get';
import { LIVE_STATUS, videoConfig, audioConfig } from '../../utils/constants';
import SocketManager from '../../socketManager';
import styles from './styles';
import LiveStreamActionButton from './LiveStreamActionButton';
import ChatInputGroup from '../../components/ChatInputGroup';
import MessagesList from '../../components/MessagesList/MessagesList';
import FloatingHearts from '../../components/FloatingHearts';

export default class Streamer extends React.Component {
  constructor(props) {
    super(props);
    const { route } = props;
    const roomName = get(route, 'params.roomName');
    const userName = get(route, 'params.userName', '');
    this.state = {
      currentLiveStatus: LIVE_STATUS.PREPARE,
      messages: [],
      countHeart: 0,
      isVisibleMessages: true,
    };
    this.roomName = roomName;
    this.userName = userName;
  }

  componentDidMount() {
    SocketManager.instance.emitPrepareLiveStream({
      userName: this.userName,
      roomName: this.roomName,
    });
    SocketManager.instance.emitJoinRoom({
      userName: this.userName,
      roomName: this.roomName,
    });
    SocketManager.instance.listenBeginLiveStream((data) => {
      const currentLiveStatus = get(data, 'liveStatus', '');
      this.setState({ currentLiveStatus });
    });
    SocketManager.instance.listenFinishLiveStream((data) => {
      const currentLiveStatus = get(data, 'liveStatus', '');
      this.setState({ currentLiveStatus });
    });
    SocketManager.instance.listenSendHeart(() => {
      this.setState((prevState) => ({ countHeart: prevState.countHeart + 1 }));
    });
    SocketManager.instance.listenSendMessage((data) => {
      const messages = get(data, 'messages', []);
      this.setState({ messages });
    });
  }

  componentWillUnmount() {
    if (this.nodeCameraViewRef) this.nodeCameraViewRef.stop();
    SocketManager.instance.emitLeaveRoom({
      userName: this.userName,
      roomName: this.roomName,
    });
  }

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

  onPressLiveStreamButton = () => {
    const { navigation, route } = this.props;
    const userName = get(route, 'params.userName', '');
    const { currentLiveStatus } = this.state;
    if (Number(currentLiveStatus) === Number(LIVE_STATUS.PREPARE)) {
      /**
       * Waiting live stream
       */
      SocketManager.instance.emitBeginLiveStream({ userName, roomName: userName });
      SocketManager.instance.emitJoinRoom({ userName, roomName: userName });
      if (this.nodeCameraViewRef) this.nodeCameraViewRef.start();
    } else if (Number(currentLiveStatus) === Number(LIVE_STATUS.ON_LIVE)) {
      /**
       * Finish live stream
       */
      SocketManager.instance.emitFinishLiveStream({ userName, roomName: userName });
      if (this.nodeCameraViewRef) this.nodeCameraViewRef.stop();
      Alert.alert(
        'Alert ',
        'Thanks for your live stream',
        [
          {
            text: 'Okay',
            onPress: () => {
              navigation.goBack();
              SocketManager.instance.emitLeaveRoom({ userName, roomName: userName });
            },
          },
        ],
        { cancelable: false }
      );
    }
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

  setCameraRef = (ref) => {
    this.nodeCameraViewRef = ref;
  };

  render() {
    const { route } = this.props;
    const { currentLiveStatus, countHeart } = this.state;
    const userName = get(route, 'params.userName', '');
    const outputUrl = `rtmp://192.168.5.143/live/${userName}`;
    return (
      <SafeAreaView style={styles.container}>
        <NodeCameraView
          style={styles.streamerView}
          ref={this.setCameraRef}
          outputUrl={outputUrl}
          camera={{ cameraId: 1, cameraFrontMirror: true }}
          audio={audioConfig}
          video={videoConfig}
          smoothSkinLevel={3}
          autopreview
        />
        <SafeAreaView style={styles.contentWrapper}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.btnClose} onPress={this.onPressClose}>
              <Image
                style={styles.icoClose}
                source={require('../../assets/close.png')}
                tintColor="white"
              />
            </TouchableOpacity>
            <LiveStreamActionButton
              currentLiveStatus={currentLiveStatus}
              onPress={this.onPressLiveStreamButton}
            />
          </View>
          <View style={styles.center} />
          <View style={styles.footer}>
            {this.renderChatGroup()}
            {this.renderListMessages()}
          </View>
        </SafeAreaView>
        <FloatingHearts count={countHeart} />
      </SafeAreaView>
    );
  }
}

Streamer.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  route: PropTypes.shape({}),
};

Streamer.defaultProps = {
  navigation: {
    goBack: null,
  },
  route: null,
};
