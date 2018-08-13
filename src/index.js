import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SocketUtils from './SocketUtils';
import HomeScreen from './screens/HomeScreen';
import ListScreen from './screens/ListScreen';
import LiveStreamScreen from './screens/LiveStreamScreen';

SocketUtils.connect();
SocketUtils.handleOnConnect();
SocketUtils.handleOnClientJoin();
SocketUtils.handleOnSendHeart();
SocketUtils.handleOnSendMessage();
SocketUtils.handleOnLeaveClient();
SocketUtils.handleOnChangedLiveStatus();

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    List: ListScreen,
    Live: LiveStreamScreen
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
);

export default class App extends Component {
  componentDidMount = () => {};

  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});
