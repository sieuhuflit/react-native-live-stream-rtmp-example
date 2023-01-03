import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { NodePlayerView } from 'react-native-nodemediaclient';
import Config from '../config';

interface IProps {
  route: RouteProp<{ params: { streamName: string } }, 'params'>;
}

export default function Viewer({ route }: IProps) {
  const { streamName } = route.params;
  if (!streamName) {
    return;
  }
  return (
    <View>
      <Text
        style={{
          alignSelf: 'center',
          fontWeight: 'bold',
          paddingVertical: 5,
        }}
      >
        Stream info: {Config.RTMP_URL}/{streamName}
      </Text>
      <NodePlayerView
        style={{
          backgroundColor: 'black',
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
        }}
        inputUrl={`${Config.RTMP_URL}/${streamName}`}
        scaleMode={'ScaleAspectFit'}
        bufferTime={300}
        maxBufferTime={1000}
        autoplay={true}
      />
    </View>
  );
}
