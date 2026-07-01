module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Required by react-native-vision-camera frame processors used by
  // react-native-mediapipe (pose detection in ARTryOn).
  plugins: [['react-native-worklets-core/plugin']],
};
