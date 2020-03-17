import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
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
SocketUtils.handleOnNotReady();

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    List: ListScreen,
    Live: LiveStreamScreen,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

const App = createAppContainer(RootStack);

export default App;
