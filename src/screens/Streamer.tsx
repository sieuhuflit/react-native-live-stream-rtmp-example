import {RouteProp} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  StyleSheet,
  Platform,
} from 'react-native';
import {NodeCameraView} from 'react-native-nodemediaclient';
import Config from '../config';

interface IProps {
  route: RouteProp<{params: {streamName: string}}, 'params'>;
}

export default function Viewer({route}: IProps) {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const nodeCameraRef = useRef<NodeCameraView>();
  const {streamName} = route.params;

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          if (nodeCameraRef.current) {
            nodeCameraRef.current.startPreview();
          }
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const onPressStreamingAction = () => {
    if (!isStreaming) {
      nodeCameraRef.current.start();
      setIsStreaming(!isStreaming);
    } else {
      nodeCameraRef.current.stop();
      setIsStreaming(!isStreaming);
    }
  };

  if (!streamName) {
    return;
  }
  return (
    <View>
      <NodeCameraView
        ref={nodeCameraRef}
        style={{
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
        }}
        outputUrl={`${Config.RTMP_URL}/${streamName}`}
        camera={{cameraId: 1, cameraFrontMirror: true}}
        audio={{bitrate: 32000, profile: 1, samplerate: 44100}}
        video={{
          preset: 12,
          bitrate: 400000,
          profile: 1,
          fps: 15,
          videoFrontMirror: false,
        }}
        autopreview={true}
      />
      <View style={styles.actionWrapper}>
        <TouchableOpacity onPress={onPressStreamingAction}>
          <Text>{isStreaming ? 'Stop' : 'Start Streaming'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionWrapper: {
    height: 50,
    position: 'absolute',
    bottom: 100,
    width: '100%',
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
