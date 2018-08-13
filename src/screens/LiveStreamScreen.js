import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Keyboard,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NodeCameraView, NodePlayerView } from 'react-native-nodemediaclient';
import SocketUtils from '../SocketUtils';
import LiveStatus from '../liveStatus';
import Utils from '../Utils';
import FloatingHearts from '../components/FloatingHearts';

const { width, height } = Dimensions.get('window');

export default class LiveStreamScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      liveStatus: LiveStatus.REGISTER,
      countViewer: 1,
      countHeart: 0,
      message: '',
      visibleListMessages: true,
      listMessages: []
    };
    this.Animation = new Animated.Value(0);
    this.scrollView = null;
  }

  componentDidMount = () => {
    Utils.setContainer(this);
    const userType = Utils.getUserType();
    if (userType === 'STREAMER') {
      this.setState({ liveStatus: LiveStatus.REGISTER });
      SocketUtils.emitRegisterLiveStream(Utils.getUserId(), Utils.getUserId());
    } else if (userType === 'VIEWER') {
      SocketUtils.emitJoinServer(Utils.getRoomName(), Utils.getUserId());
      this.StartBackgroundColorAnimation();
    } else if (userType === 'REPLAY') {
      SocketUtils.emitReplay(Utils.getRoomName(), Utils.getUserId());
    }
  };

  StartBackgroundColorAnimation = () => {
    this.Animation.setValue(0);

    Animated.timing(this.Animation, {
      toValue: 1,
      duration: 15000
    }).start(() => {
      this.StartBackgroundColorAnimation();
    });
  };

  onBeginLiveStream = () => {
    this.setState({ liveStatus: LiveStatus.ON_LIVE });
    SocketUtils.emitBeginLiveStream(Utils.getRoomName(), Utils.getUserId());
    this.vbCamera.start();
  };

  onFinishLiveStream = () => {
    this.setState({ liveStatus: LiveStatus.FINISH });
    SocketUtils.emitFinishLiveStream(Utils.getRoomName(), Utils.getUserId());
    this.vbCamera.stop();
  };

  onPressHeart = () => {
    this.setState({ countHeart: this.state.countHeart + 1 });
    SocketUtils.emitSendHeart(Utils.getRoomName());
  };

  onChangeMessageText = text => {
    this.setState({ message: text });
  };

  onPressSend = () => {
    const { message, listMessages } = this.state;
    if (message !== '') {
      this.setState({ message: '' });
      Keyboard.dismiss();
      const newListMessages = listMessages.slice();
      newListMessages.push({ userId: Utils.getUserId(), message });
      this.setState({
        listMessages: newListMessages,
        visibleListMessages: true
      });
      SocketUtils.emitSendMessage(
        Utils.getRoomName(),
        Utils.getUserId(),
        message
      );
    }
  };

  onPressCancelViewer = () => {
    if (this.vbViewer !== null && this.vbViewer !== undefined) {
      this.vbViewer.stop();
    }
    SocketUtils.emitLeaveServer(Utils.getRoomName(), Utils.getUserId());
    this.props.navigation.goBack();
  };

  renderCancelViewerButton = () => {
    return (
      <TouchableOpacity
        style={styles.buttonCancel}
        onPress={this.onPressCancelViewer}
      >
        <Image
          source={require('../assets/ico_cancel.png')}
          style={styles.iconCancel}
        />
      </TouchableOpacity>
    );
  };

  onPressCancelReplay = () => {
    Utils.clearTimeOutMessages();
    if (this.vbReplay !== null && this.vbReplay !== undefined) {
      this.vbReplay.stop();
    }
    SocketUtils.emitLeaveServer(Utils.getRoomName(), Utils.getUserId());
    this.props.navigation.goBack();
  };

  renderCancelReplayButton = () => {
    return (
      <TouchableOpacity
        style={styles.buttonCancel}
        onPress={this.onPressCancelReplay}
      >
        <Image
          source={require('../assets/ico_cancel.png')}
          style={styles.iconCancel}
        />
      </TouchableOpacity>
    );
  };

  onPressCancelStreamer = () => {
    if (this.vbCamera !== null && this.vbCamera !== undefined) {
      this.vbCamera.stop();
    }
    const { liveStatus } = this.state;
    if (
      liveStatus === LiveStatus.REGISTER ||
      liveStatus === LiveStatus.ON_LIVE
    ) {
      return Alert.alert(
        'Alert',
        'Are you sure to discard your live stream, a lot people is watching right now.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'Sure',
            onPress: () => {
              SocketUtils.emitCancelLiveStream(
                Utils.getRoomName(),
                Utils.getUserId()
              );
              SocketUtils.emitLeaveServer(
                Utils.getRoomName(),
                Utils.getUserId()
              );
              this.props.navigation.goBack();
            }
          }
        ]
      );
    }
    this.props.navigation.goBack();
  };

  renderCancelStreamerButton = () => {
    return (
      <TouchableOpacity
        style={styles.buttonCancel}
        onPress={this.onPressCancelStreamer}
      >
        <Image
          source={require('../assets/ico_cancel.png')}
          style={styles.iconCancel}
        />
      </TouchableOpacity>
    );
  };

  renderLiveText = () => {
    const { liveStatus } = this.state;
    return (
      <View
        style={
          liveStatus === LiveStatus.ON_LIVE
            ? styles.wrapLiveText
            : styles.wrapNotLiveText
        }
      >
        <Text
          style={
            liveStatus === LiveStatus.ON_LIVE
              ? styles.liveText
              : styles.notLiveText
          }
        >
          LIVE
        </Text>
      </View>
    );
  };

  renderGroupInput = () => {
    const { message } = this.state;
    if (Platform.OS === 'ios') {
      return (
        <KeyboardAccessory>
          <View style={styles.wrapBottom}>
            <TextInput
              style={styles.textInput}
              placeholder="Comment input"
              underlineColorAndroid="transparent"
              onChangeText={this.onChangeMessageText}
              value={message}
              onEndEditing={this.onPressSend}
              autoCapitalize={'none'}
              autoCorrect={false}
              onFocus={() => this.setState({ visibleListMessages: false })}
              onEndEditing={() => {
                Keyboard.dismiss();
                this.setState({ visibleListMessages: true });
              }}
            />
            <TouchableOpacity
              style={styles.wrapIconSend}
              onPress={this.onPressSend}
              activeOpacity={0.6}
            >
              <Image
                source={require('../assets/ico_send.png')}
                style={styles.iconSend}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapIconHeart}
              onPress={this.onPressHeart}
              activeOpacity={0.6}
            >
              <Image
                source={require('../assets/ico_heart.png')}
                style={styles.iconHeart}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAccessory>
      );
    } else {
      return (
        <View style={styles.wrapBottom}>
          <TextInput
            style={styles.textInput}
            placeholder="Comment input"
            underlineColorAndroid="transparent"
            onChangeText={this.onChangeMessageText}
            value={message}
          />
          <TouchableOpacity
            style={styles.wrapIconSend}
            onPress={this.onPressSend}
            activeOpacity={0.6}
          >
            <Image
              source={require('../assets/ico_send.png')}
              style={styles.iconSend}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wrapIconHeart}
            onPress={this.onPressHeart}
            activeOpacity={0.6}
          >
            <Image
              source={require('../assets/ico_heart.png')}
              style={styles.iconHeart}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  renderListMessages = () => {
    const { listMessages, visibleListMessages } = this.state;
    if (!visibleListMessages) {
      return null;
    }
    return (
      <View style={styles.wrapListMessages}>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.scrollView.scrollToEnd({ animated: true });
          }}
        >
          {listMessages.length > 0 &&
            listMessages.map(item => {
              return (
                <View style={styles.chatItem}>
                  <View style={styles.wrapAvatar}>
                    {item.avatar ? (
                      <Image source={item.avatar} style={styles.iconAvatar} />
                    ) : (
                      <Image
                        source={require('../assets/ico_heart.png')}
                        style={styles.iconAvatar}
                      />
                    )}
                  </View>
                  <View style={styles.messageItem}>
                    <Text style={styles.name}>{item.userId}</Text>
                    <Text style={styles.content}>{item.message}</Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  };
  renderStreamerUI = () => {
    const BackgroundColorConfig = this.Animation.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [
        '#1abc9c',
        '#3498db',
        '#9b59b6',
        '#34495e',
        '#f1c40f',
        '#1abc9c'
      ]
    });
    const { liveStatus, countViewer, countHeart } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <NodeCameraView
          style={styles.streamerCameraView}
          ref={vb => {
            this.vbCamera = vb;
          }}
          outputUrl={Utils.getRtmpPath() + Utils.getRoomName()}
          // outputUrl={'rtmp://192.168.1.2/live/' + Utils.getRoomName()}
          camera={{ cameraId: 1, cameraFrontMirror: true }}
          audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
          video={{
            preset: 24,
            bitrate: 400000,
            profile: 2,
            fps: 30,
            videoFrontMirror: true
          }}
          autopreview
          smoothSkinLevel={5}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            this.setState({ visibleListMessages: true });
          }}
          accessible={false}
        >
          <View style={styles.container}>
            {this.renderCancelStreamerButton()}
            {this.renderLiveText()}
            <View style={styles.wrapIconView}>
              <Image
                source={require('../assets/ico_view.png')}
                style={styles.iconView}
              />
              <View style={styles.wrapTextViewer}>
                <Text style={styles.textViewer}>{countViewer}</Text>
              </View>
            </View>
            {this.renderGroupInput()}
            <FloatingHearts count={countHeart} style={styles.wrapGroupHeart} />
            {liveStatus === LiveStatus.REGISTER && (
              <TouchableOpacity
                style={styles.beginLiveStreamButton}
                onPress={this.onBeginLiveStream}
              >
                <Text style={styles.beginLiveStreamText}>Begin Live</Text>
              </TouchableOpacity>
            )}
            {liveStatus === LiveStatus.ON_LIVE && (
              <TouchableOpacity
                style={styles.finishLiveStreamButton}
                onPress={this.onFinishLiveStream}
              >
                <Text style={styles.beginLiveStreamText}>Finish</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
        {this.renderListMessages()}
      </View>
    );
  };

  renderViewerUI = () => {
    const BackgroundColorConfig = this.Animation.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [
        '#1abc9c',
        '#3498db',
        '#9b59b6',
        '#34495e',
        '#f1c40f',
        '#1abc9c'
      ]
    });
    const { countViewer, countHeart, liveStatus } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            this.setState({ visibleListMessages: true });
          }}
          accessible={false}
        >
          <Animated.View
            style={[
              styles.container,
              { backgroundColor: BackgroundColorConfig }
            ]}
          >
            {liveStatus === LiveStatus.ON_LIVE && (
              <NodePlayerView
                style={styles.streamerCameraView}
                ref={vb => {
                  this.vbViewer = vb;
                }}
                inputUrl={Utils.getRtmpPath() + Utils.getRoomName()}
                // inputUrl={'rtmp://192.168.1.2/live/' + Utils.getRoomName()}
                scaleMode="ScaleAspectFit"
                bufferTime={300}
                maxBufferTime={1000}
                autoplay
              />
            )}
            {this.renderCancelViewerButton()}
            {this.renderLiveText()}
            <View style={styles.wrapIconView}>
              <Image
                source={require('../assets/ico_view.png')}
                style={styles.iconView}
              />
              <View style={styles.wrapTextViewer}>
                <Text style={styles.textViewer}>{countViewer}</Text>
              </View>
            </View>
            {liveStatus === LiveStatus.REGISTER && (
              <View style={styles.wrapPromotionText}>
                <Text style={styles.textPromotion}>
                  Stay here and wait until start live stream you will get 30%
                  discount 😉
                </Text>
              </View>
            )}
            <FloatingHearts count={countHeart} style={styles.wrapGroupHeart} />
            {this.renderGroupInput()}
          </Animated.View>
        </TouchableWithoutFeedback>
        {this.renderListMessages()}
      </View>
    );
  };

  renderReplayUI = () => {
    const { countViewer } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            this.setState({ visibleListMessages: true });
          }}
          accessible={false}
        >
          <View style={styles.container}>
            <NodePlayerView
              style={styles.streamerCameraView}
              ref={vb => {
                this.vbReplay = vb;
              }}
              inputUrl={
                Utils.getRtmpPath() +
                Utils.getRoomName() +
                '/replayfor' +
                Utils.getUserId()
              }
              // inputUrl={
              //   'rtmp://192.168.1.2/live/' +
              //   Utils.getRoomName() +
              //   '/replayfor' +
              //   Utils.getUserId()
              // }
              scaleMode="ScaleAspectFit"
              bufferTime={300}
              maxBufferTime={1000}
              autoplay
            />
            {this.renderCancelReplayButton()}
            {this.renderLiveText()}
            <View style={styles.wrapIconView}>
              <Image
                source={require('../assets/ico_view.png')}
                style={styles.iconView}
              />
              <View style={styles.wrapTextViewer}>
                <Text style={styles.textViewer}>{countViewer}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {this.renderListMessages()}
      </View>
    );
  };

  render() {
    const type = Utils.getUserType();
    console.log(type);
    if (type === 'STREAMER') {
      return this.renderStreamerUI();
    } else if (type === 'VIEWER') {
      return this.renderViewerUI();
    } else {
      return this.renderReplayUI();
    }
  }
}

const styles = StyleSheet.create({
  containerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 0
  },
  container: {
    flex: 1,
    zIndex: 0
  },
  wrapPromotionText: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0
  },
  textPromotion: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '200'
  },
  wrapLiveText: {
    position: 'absolute',
    top: 15,
    left: 60,
    backgroundColor: 'rgba(231, 76, 60, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  liveText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white'
  },
  wrapNotLiveText: {
    position: 'absolute',
    top: 15,
    left: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  notLiveText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white'
  },
  wrapIconView: {
    height: 40,
    flexDirection: 'row',
    position: 'absolute',
    top: 15,
    left: 130,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  iconView: {
    width: 25,
    height: 25,
    tintColor: 'white'
  },
  wrapTextViewer: {
    marginLeft: 5
  },
  textViewer: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500'
  },
  streamerCameraView: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: height,
    width: width,
    zIndex: 0
  },
  beginLiveStreamButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#a55eea',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  finishLiveStreamButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  beginLiveStreamText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white'
  },
  wrapGroupHeart: {
    marginBottom: 70
  },
  wrapBottom: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: height / 2,
    width: width,
    zIndex: 90000
  },
  textInput: {
    position: 'absolute',
    bottom: 4,
    left: 15,
    right: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 42,
    zIndex: 2
  },
  wrapIconHeart: {
    position: 'absolute',
    bottom: 5,
    right: 12,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  iconHeart: {
    width: 42,
    height: 42,
    zIndex: 2
  },
  wrapIconSend: {
    position: 'absolute',
    bottom: 5,
    right: 65,
    width: 42,
    height: 42,
    borderRadius: 42,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  iconSend: {
    width: 33,
    height: 33,
    zIndex: 2
  },
  wrapListMessages: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    height: width / 1.5,
    width: width,
    zIndex: 2
  },
  chatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 5,
    zIndex: 2
  },
  messageItem: {
    flexDirection: 'column',
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    zIndex: 2
  },
  iconAvatar: {
    width: 44,
    height: 44,
    zIndex: 2
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    zIndex: 2
  },
  content: {
    fontSize: 13,
    zIndex: 2
  },
  buttonCancel: {
    height: 40,
    flexDirection: 'row',
    position: 'absolute',
    top: 15,
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  iconCancel: {
    width: 20,
    height: 20,
    tintColor: 'white',
    zIndex: 2
  }
});
