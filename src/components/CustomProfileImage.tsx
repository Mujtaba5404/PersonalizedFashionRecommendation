import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from '@react-native-vector-icons/ant-design';
import { fontFamily } from '../assets/Fonts';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';

interface CustomProfImgModalProps {
  modalOpen: boolean;
  toggleModal: () => void;
  gallery: () => void;
  camera: () => void;
}



const CustomProfileImgModal: React.FC<CustomProfImgModalProps> = ({
  modalOpen,
  toggleModal,
  gallery,
  camera,
}) => {
  const [animatedHeight] = useState(new Animated.Value(0));
  const [uploadScale] = useState(new Animated.Value(1));
  const [cameraScale] = useState(new Animated.Value(1));
//   const selectedRole = useSelector(
//     (state: RootState) => state.role.selectedRole,
//   );

  const animatePress = (anim: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.1, // expand
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1, // shrink back
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback); // run action after animation
  };

  const animateModal = () => {
    Animated.timing(animatedHeight, {
      toValue: height * 0.2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (modalOpen) {
      animateModal();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [modalOpen]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalOpen}
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={toggleModal}>
        <BlurView
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
          style={styles.modalBlur}
        />
      </TouchableWithoutFeedback>

      <View style={{ height: height, width: width }}>
        <Animated.View style={[styles.callModal, { height: animatedHeight }]}>
              <View style={styles.btnMain}>
                <View style={styles.uploadMain}>
                  <AntDesign
                    name="upload"
                    color={colors.gray}
                    size={width * 0.07}
                    style={styles.icon}
                  />
                  <Animated.Text
                    onPress={() => animatePress(uploadScale, gallery)}
                    style={[
                      styles.modalTextSec,
                      { transform: [{ scale: uploadScale }] },
                    ]}
                  >
                    Upload Photo
                  </Animated.Text>
                </View>
                <View style={styles.cameraMain}>
                  <AntDesign
                    name="camera"
                    color={colors.marhoon}
                    size={width * 0.07}
                    style={styles.icon}
                  />
                  <Animated.Text
                    onPress={() => animatePress(cameraScale, camera)}
                    style={[
                      styles.modalTextSec,
                      { transform: [{ scale: cameraScale }] },
                    ]}
                  >
                    Use Camera
                  </Animated.Text>
                </View>
              </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBlur: {
    flex: 1,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  callModal: {
    width: width,
    height: height * 0.1,
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    borderColor: colors.white,
    borderWidth: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  btnMain: {
    gap: height * 0.02,
    width: width * 1.1,
    marginBottom: height * 0.04
  },
  uploadMain: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.brownishRed,
    paddingVertical: height * 0.01,
  },
  cameraMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    height: height * 0.03,
    width: width * 0.3,
  },
  modalText: {
    fontFamily: fontFamily.ClashDisplayMedium,
    fontSize: fontSizes.md,
    color: colors.browm,
  },
  modalTextSec: {
    fontFamily: fontFamily.ClashDisplayMedium,
    fontSize: fontSizes.lg,
    color: colors.lightmarhoon,
    left: width * 0.1,
  },
  icon: {
    paddingLeft: Platform.OS === 'ios' ? width * 0.1 : width * 0.1,
  },
});

export default CustomProfileImgModal;
