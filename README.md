# react-native-live-stream-rtmp-example

React native live streaming using RTMP.

Server : https://github.com/sieuhuflit/live-stream-rtmp-server

## Demo

| Streamer                                                                                                             | Viewer                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| <img src="https://raw.githubusercontent.com/sieuhuflit/react-native-live-stream-rtmp-example/master/streamer.gif" /> | <img src="https://raw.githubusercontent.com/sieuhuflit/react-native-live-stream-rtmp-example/master/viewer.gif" /> |

## Teachnology using

Using react-native-nodemediaclient. Connect with RTMP server

- [RTMP Server](https://github.com/sieuhuflit/live-tream-rtmp-server) - Node media server using NodeJS
  Server

## Config

- Config the SocketIO ip address and RTMP server path, custom your IP_ADDRESS, PORT, and PATH_LIVE_STREAM

```js
const socketIOIP = 'http://IP_ADDRESS:PORT';
const rtmpPath = 'rtmp://IP_ADDRESS/PATH_LIVE_STREAM/';
```

## Install package

```bash
npm install
```

## Running the App

### iOS

```bash
react-native run-ios
```

### Android

```bash
react-native run-android
```
