import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import Viewer from './src/screens/Viewer';
import Streamer from './src/screens/Streamer';

export type RootStackParamList = {
  Home: {};
  Viewer: {streamName: string};
  Streamer: {streamName: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Viewer" component={Viewer} />
        <Stack.Screen name="Streamer" component={Streamer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
