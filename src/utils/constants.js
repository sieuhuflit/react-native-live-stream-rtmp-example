/* eslint-disable */
const LIVE_STATUS = {
  PREPARE: 0,
  ON_LIVE: 1,
  FINISH: 2,
};

const videoConfig = {
  preset: 1,
  bitrate: 500000,
  profile: 1,
  fps: 15,
  videoFrontMirror: false,
};

const audioConfig = { bitrate: 32000, profile: 1, samplerate: 44100 };

export { videoConfig, audioConfig, LIVE_STATUS };
