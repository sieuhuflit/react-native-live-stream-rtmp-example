import { StyleSheet } from 'react-native';
import * as Utility from '../../utils/utility';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
  },
  contentWrapper: { flex: 1 },
  header: { flex: 0.1, justifyContent: 'space-around', flexDirection: 'row' },
  footer: { flex: 0.1 },
  center: { flex: 0.8 },
  streamerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Utility.screenHeight,
    width: Utility.screenWidth,
  },
  btnClose: { position: 'absolute', top: 15, left: 15 },
  icoClose: { width: 28, height: 28 },
  bottomGroup: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  btnBeginLiveStream: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 5,
  },
  beginLiveStreamText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default styles;
