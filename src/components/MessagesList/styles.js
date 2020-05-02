import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapListMessages: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    height: screenWidth / 1.5,
    width: screenWidth,
    zIndex: 2,
  },
  chatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 5,
  },
  messageItem: {
    flexDirection: 'column',
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  avatar: {
    width: 45,
    height: 45,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 3,
  },
});

export default styles;
