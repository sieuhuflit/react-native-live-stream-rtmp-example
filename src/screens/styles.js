import { Platform, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  container: {
    flex: 1,
    zIndex: 2
  },
  viewDismissKeyboard: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: height,
    width: width,
    zIndex: 2
  },
  wrapPromotionText: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textPromotion: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '200'
  },
  wrapLiveText: {
    position: 'absolute',
    top: 30,
    left: 60,
    backgroundColor: 'rgba(231, 76, 60, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  liveText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white'
  },
  wrapNotLiveText: {
    position: 'absolute',
    top: 30,
    left: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
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
    top: 30,
    left: 130,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
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
    zIndex: 1
  },
  beginLiveStreamButton: {
    position: 'absolute',
    top: 30,
    right: 15,
    backgroundColor: '#a55eea',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  finishLiveStreamButton: {
    position: 'absolute',
    top: 30,
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
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 2
  },
  wrapBottomIOS: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2
  },
  wrapInputAndActionButton: {
    position: 'absolute',
    bottom: 10,
    width: width - 20,
    flex: 1,
    flexDirection: 'row',
    height: 50,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    paddingTop: Platform.OS === 'android' ? 10 : 0
  },
  wrapIconHeart: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    zIndex: 2
  },
  iconHeart: {
    width: 45,
    height: 45,
    zIndex: 2
  },
  wrapIconSend: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  iconSend: {
    width: 33,
    height: 33
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
    marginVertical: 5
  },
  messageItem: {
    flexDirection: 'column',
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15
  },
  iconAvatar: {
    width: 44,
    height: 44
  },
  iconProduct: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10
  },
  name: {
    fontSize: 15,
    fontWeight: '700'
  },
  content: {
    fontSize: 13
  },
  buttonCancel: {
    height: 40,
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
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
  buttonCloseModal: {
    height: 40,
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconCancel: {
    width: 20,
    height: 20,
    tintColor: 'white'
  },
  col: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  wrapSeeDetail: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  wrapWebview: {
    flex: 0.8,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginHorizontal: 20
  },
  textShowDetail: {
    marginLeft: 5,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'skyblue',
    width: 120
  }
});

export default styles;
