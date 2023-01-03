# React native live stream RTMP Example

An example live stream rtmp application using React native

## Getting Started

We need the RTMP server first. Download the repository below and follow the README information.

Server : https://github.com/sieuhuflit/live-tream-rtmp-server

## Config

Before start, open config.ts file to edit RTMP server ip address

```
const Config = {
  RTMP_URL: 'rtmp://{YOUR_RTMP_IP_ADDRESS_HERE}/live',
};

export default Config;
```

## Install package

```bash
yarn install
```

## Running the App

### iOS

```bash
yarn run ios
```

### Android

```bash
yarn run run-android
```

## FAQ

1. Start live stream iOS simulator not displayed
   Start live stream not worked on iOS simulator, please test start live stream feature on real iOS device

2. Display blanked when join room on Android
   Make sure you change IP address on step above

## License

[MIT](https://choosealicense.com/licenses/mit/)
