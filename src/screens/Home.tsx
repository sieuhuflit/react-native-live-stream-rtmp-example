import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { RootStackParamList } from '../../App';

function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [streamName, setStreamName] = useState<string>('');

  const onPressBeginStream = () => {
    if (streamName === '') {
      return;
    }
    navigation.navigate('Streamer', { streamName });
  };

  const onPressJoinStream = () => {
    if (streamName === '') {
      return;
    }
    navigation.navigate('Viewer', { streamName });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Please input stream name"
        autoCapitalize="none"
        autoComplete="off"
        onChangeText={(text) => setStreamName(text)}
        value={streamName}
      />
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={onPressBeginStream} style={styles.button}>
          <Text style={styles.buttonText}>Start live stream</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressJoinStream} style={styles.button}>
          <Text style={styles.buttonText}>Join stream</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 15, marginTop: 20 },
  input: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#16a085',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default Home;
