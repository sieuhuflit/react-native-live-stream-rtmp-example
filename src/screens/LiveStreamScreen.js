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
  Animated,
  TextInput,
  Platform,
  Alert,
  ScrollView,
  LayoutAnimation,
  WebView,
  Modal,
  StatusBar
} from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import { NodeCameraView, NodePlayerView } from 'react-native-nodemediaclient';
import SocketUtils from '../SocketUtils';
import LiveStatus from '../liveStatus';
import Utils from '../Utils';
import FloatingHearts from '../components/FloatingHearts';
import Draggable from '../components/Draggable';
import styles from './styles';

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
      listMessages: [
        // {
        //   userId: 'user1',
        //   message: 'Link for info about product 1',
        //   productId: 1,
        //   productImageUrl:
        //     'https://cf.shopee.vn/file/3c18ee889c242196030a86b7ce86a59e_tn',
        //   productUrl:
        //     'https://shopee.vn/Áo-sơ-mi-lụa-dài-tay-kẻ-sọc-nam-…-style-Hàn-Quốc-MỚI-(7-màu)-i.12260860.1025065219'
        // }
      ],
      dropZoneCoordinates: null,
      keyboardHeight: 0,
      productId: null,
      productUrl: null,
      productImageUrl: null,
      modalVisible: false,
      keyboardHeight: 0,
      inputHeight: 40
    };
    this.Animation = new Animated.Value(0);
    this.scrollView = null;
  }

  componentDidMount = () => {
    let keyboardShowEvent = 'keyboardWillShow';
    let keyboardHideEvent = 'keyboardWillHide';

    if (Platform.OS === 'android') {
      keyboardShowEvent = 'keyboardDidShow';
      keyboardHideEvent = 'keyboardDidHide';
    }
    this.keyboardShowListener = Keyboard.addListener(keyboardShowEvent, e =>
      this.keyboardShow(e)
    );
    this.keyboardHideListener = Keyboard.addListener(keyboardHideEvent, e =>
      this.keyboardHide(e)
    );

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

  keyboardShow(e) {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      keyboardHeight: e.endCoordinates.height
    });
  }

  keyboardHide(e) {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      keyboardHeight: 0
    });
  }

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
    const {
      message,
      listMessages,
      productId,
      productImageUrl,
      productUrl
    } = this.state;
    if (productId !== null && productUrl !== null && productImageUrl !== null) {
      this.setState({ message: '' });
      Keyboard.dismiss();
      const newListMessages = listMessages.slice();
      newListMessages.push({
        userId: Utils.getUserId(),
        message,
        productId,
        productImageUrl,
        productUrl
      });
      this.setState({
        listMessages: newListMessages,
        visibleListMessages: true,
        productId: null,
        productUrl: null,
        productImageUrl: null
      });
      SocketUtils.emitSendMessage(
        Utils.getRoomName(),
        Utils.getUserId(),
        message,
        productId,
        productImageUrl,
        productUrl
      );
    } else if (message !== '') {
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

  onPressCloseModal = () => {
    this.setState({
      productId: null,
      productUrl: null,
      productImageUrl: null,
      modalVisible: false
    });
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

  setDropZoneValues = ({ nativeEvent }) => {
    const layout = {
      y: nativeEvent.layout.y,
      width: nativeEvent.layout.width,
      x: nativeEvent.layout.x,
      height: nativeEvent.layout.height,
      keyboardHeight: this.state.keyboardHeight
    };
    this.setState({
      dropZoneCoordinates: layout
    });
  };

  onPressProduct = item => {
    this.setState({
      modalVisible: true,
      productId: item.id,
      productImageUrl: item.productImageUrl,
      productUrl: item.productUrl
    });
  };

  onFinishDragProduct1 = () => {
    this.setState({
      message: 'Link for info about product 1',
      productId: 1,
      productImageUrl:
        'https://cf.shopee.vn/file/3c18ee889c242196030a86b7ce86a59e_tn',
      productUrl:
        'https://shopee.vn/Áo-sơ-mi-lụa-dài-tay-kẻ-sọc-nam-nữ-cổ-Vest-unisex-mịn-mát-giá-rẻ-áo-style-Hàn-Quốc-MỚI-(7-màu)-i.12260860.1025065219'
    });
  };

  onFinishDragProduct2 = () => {
    this.setState({
      message: 'Link for info about product 2',
      productId: 2,
      productImageUrl:
        'https://cf.shopee.vn/file/1366956e12b7c40936a1e11ffe1bd486_tn',
      productUrl: 'https://shopee.vn/Giày-thể-thao-nữ-G425-i.35709944.626245005'
    });
  };

  onFinishDragProduct3 = () => {
    this.setState({
      message: 'Link for info about product 3',
      productId: 3,
      productImageUrl:
        'https://cf.shopee.vn/file/31df73f75132ec3f979c39c550e249b5',
      productUrl:
        'https://shopee.vn/⚡Free-ship-Giầy-PROPHERE-Nam-Nữ-đế-mầu-cực-chất-(sẵn-hình-thật-hộp)-083-i.7466021.1123770706'
    });
  };

  renderGroupInput = () => {
    const { message, dropZoneCoordinates, keyboardHeight } = this.state;
    if (Platform.OS === 'android') {
      return (
        <View
          onLayout={this.setDropZoneValues}
          style={{
            flex: 1,
            height: this.state.keyboardHeight,
            zIndex: -1
          }}
        >
          <View style={styles.wrapBottom}>
            {keyboardHeight > 0 &&
              Utils.getUserType() === 'STREAMER' && (
                <View style={styles.row}>
                  <Draggable
                    imageUrl={
                      'https://cf.shopee.vn/file/3c18ee889c242196030a86b7ce86a59e_tn'
                    }
                    dropZoneCoordinates={dropZoneCoordinates}
                    onFinishDragProduct={this.onFinishDragProduct1}
                  />
                  <Draggable
                    imageUrl={
                      'https://cf.shopee.vn/file/1366956e12b7c40936a1e11ffe1bd486_tn'
                    }
                    dropZoneCoordinates={dropZoneCoordinates}
                    onFinishDragProduct={this.onFinishDragProduct2}
                  />
                  <Draggable
                    imageUrl={
                      'https://cf.shopee.vn/file/31df73f75132ec3f979c39c550e249b5'
                    }
                    dropZoneCoordinates={dropZoneCoordinates}
                    onFinishDragProduct={this.onFinishDragProduct3}
                  />
                </View>
              )}
            <View style={styles.wrapInputAndActionButton}>
              <TextInput
                style={styles.textInput}
                placeholder="Comment input"
                underlineColorAndroid="transparent"
                onChangeText={this.onChangeMessageText}
                value={message}
                onEndEditing={this.onPressSend}
                autoCapitalize={'none'}
                autoCorrect={false}
                onFocus={() => {
                  this.setState({ visibleListMessages: false });
                }}
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
          </View>
        </View>
      );
    } else {
      return (
        <KeyboardAccessory backgroundColor="transparent">
          <View style={styles.wrapBottomIOS}>
            <View style={styles.col}>
              {keyboardHeight > 0 &&
                Utils.getUserType() === 'STREAMER' && (
                  <View style={styles.row}>
                    <Draggable
                      imageUrl={
                        'https://cf.shopee.vn/file/3c18ee889c242196030a86b7ce86a59e_tn'
                      }
                      dropZoneCoordinates={dropZoneCoordinates}
                      onFinishDragProduct={this.onFinishDragProduct1}
                    />
                    <Draggable
                      imageUrl={
                        'https://cf.shopee.vn/file/1366956e12b7c40936a1e11ffe1bd486_tn'
                      }
                      dropZoneCoordinates={dropZoneCoordinates}
                      onFinishDragProduct={this.onFinishDragProduct2}
                    />
                    <Draggable
                      imageUrl={
                        'https://cf.shopee.vn/file/31df73f75132ec3f979c39c550e249b5'
                      }
                      dropZoneCoordinates={dropZoneCoordinates}
                      onFinishDragProduct={this.onFinishDragProduct3}
                    />
                  </View>
                )}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  height: 45,
                  marginHorizontal: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                  alignItems: 'center'
                }}
                onLayout={this.setDropZoneValues}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Comment input"
                  underlineColorAndroid="transparent"
                  onChangeText={this.onChangeMessageText}
                  value={message}
                  onEndEditing={this.onPressSend}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onFocus={() => {
                    this.setState({ visibleListMessages: false });
                  }}
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
            </View>
          </View>
        </KeyboardAccessory>
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
            listMessages.map((item, index) => {
              const {
                productId,
                productUrl,
                productImageUrl,
                userId,
                message
              } = item;
              return (
                <View style={styles.chatItem} key={index}>
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
                    {productId !== undefined &&
                      productUrl !== undefined &&
                      productImageUrl !== undefined && (
                        <TouchableWithoutFeedback
                          onPress={() => this.onPressProduct(item)}
                        >
                          <View style={styles.wrapSeeDetail}>
                            <Image
                              source={{ uri: productImageUrl }}
                              style={styles.iconProduct}
                            />
                            <Text style={styles.textShowDetail}>
                              Click here to see detail
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )}

                    <Text style={styles.name}>{userId}</Text>
                    <Text style={styles.content}>{message}</Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  };
  renderStreamerUI = () => {
    const { liveStatus, countViewer, countHeart } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
        <NodeCameraView
          style={styles.streamerCameraView}
          ref={vb => {
            this.vbCamera = vb;
          }}
          outputUrl={Utils.getRtmpPath() + Utils.getRoomName()}
          camera={{ cameraId: 1, cameraFrontMirror: true }}
          audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
          video={{
            preset: 1,
            bitrate: 500000,
            profile: 1,
            fps: 15,
            videoFrontMirror: false
          }}
          smoothSkinLevel={3}
          autopreview={true}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            this.setState({ visibleListMessages: true });
          }}
          accessible={false}
          style={styles.viewDismissKeyboard}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity
              style={styles.buttonCloseModal}
              onPress={this.onPressCloseModal}
            >
              <Image
                source={require('../assets/ico_cancel.png')}
                style={styles.iconCancel}
              />
            </TouchableOpacity>
            <View style={styles.wrapWebview}>
              <WebView source={{ uri: this.state.productUrl }} />
            </View>
          </View>
        </Modal>
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity
              style={styles.buttonCloseModal}
              onPress={this.onPressCloseModal}
            >
              <Image
                source={require('../assets/ico_cancel.png')}
                style={styles.iconCancel}
              />
            </TouchableOpacity>
            <View style={styles.wrapWebview}>
              <WebView source={{ uri: this.state.productUrl }} />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  renderReplayUI = () => {
    const { countViewer } = this.state;

    return (
      <View style={styles.container}>
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
    if (type === 'STREAMER') {
      return this.renderStreamerUI();
    } else if (type === 'VIEWER') {
      return this.renderViewerUI();
    } else {
      return this.renderReplayUI();
    }
  }
}
