import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import Utils from '../Utils';

export default class ListScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: Utils.getUserId()
  });
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Button
          title="READY TO LIVE STREAM"
          onPress={() => {
            Utils.setUserType('STREAMER');
            Utils.setRoomName(Utils.getUserId());
            this.props.navigation.navigate('Live');
          }}
        />
        <View style={styles.line}>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              Utils.setUserType('VIEWER');
              Utils.setRoomName('user1');
              this.props.navigation.navigate('Live');
            }}
          >
            <Text style={styles.text}>View User1 Live Stream</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => {
              Utils.setUserType('REPLAY');
              Utils.setRoomName('user1');
              this.props.navigation.navigate('Live');
            }}
          >
            <Image
              source={require('../assets/ico_play.png')}
              style={styles.iconPlay}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.line}>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => {
              Utils.setUserType('VIEWER');
              Utils.setRoomName('user2');
              this.props.navigation.navigate('Live');
            }}
          >
            <Text style={styles.text}>View User2 Live Stream</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => {
              Utils.setUserType('REPLAY');
              Utils.setRoomName('user2');
              this.props.navigation.navigate('Live');
            }}
          >
            <Image
              source={require('../assets/ico_play.png')}
              style={styles.iconPlay}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.line}>
          <TouchableOpacity
            style={styles.button3}
            onPress={() => {
              Utils.setUserType('VIEWER');
              Utils.setRoomName('user3');
              this.props.navigation.navigate('Live');
            }}
          >
            <Text style={styles.text}>View User3 Live Stream</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => {
              Utils.setUserType('REPLAY');
              Utils.setRoomName('user3');
              this.props.navigation.navigate('Live');
            }}
          >
            <Image
              source={require('../assets/ico_play.png')}
              style={styles.iconPlay}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button1: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#34495e',
    marginHorizontal: 20,
    borderRadius: 10
  },
  button2: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1abc9c',
    marginHorizontal: 20,
    borderRadius: 10
  },
  button3: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    marginHorizontal: 20,
    borderRadius: 10
  },
  text: {
    fontSize: 20,
    color: 'white'
  },
  line: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonPlay: {
    width: 60,
    height: 60,
    justifyContent: 'center'
  },
  iconPlay: {
    flex: 1,
    height: undefined,
    width: undefined
  }
});
