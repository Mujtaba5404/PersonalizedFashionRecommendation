import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, ImageBackground, Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import TopHeader from '../components/Topheader';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

const ChangePassword = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [password, setPassword] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setconfirmPassword] = useState('');
  const [currentPassword, setcurrentPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(false)
    navigation.goBack()
  }

  return (
    <ImageBackground
    source={images.Background}
    >
      <View style={styles.topHeader}>
        <TopHeader text="Change Password" isBack={true} />
      </View>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <CustomTextInput
            placeholder="Current Password"
            placeholderTextColor={colors.black}
            inputHeight={height * 0.06}
            inputWidth={width * 0.85}
            borderRadius={14}
            isPassword={true}
            value={oldPass}         
            onChangeText={setOldPass}
          />
        </View>

        <View style={{ gap: height * 0.04 }}>
          <Text style={styles.text}>Set New Password</Text>
        </View>

        <View style={styles.inputMain}>
          <CustomTextInput
            placeholder="Password"
            placeholderTextColor={colors.black}
            inputHeight={height * 0.06}
            inputWidth={width * 0.85}
            borderRadius={14}
            isPassword={true}
            value={password}
            onChangeText={setPassword}
          />
          <CustomTextInput
            placeholder="Confirm Password"
            placeholderTextColor={colors.black}
            inputHeight={height * 0.06}
            inputWidth={width * 0.85}
            borderRadius={14}
            isPassword={true}
            value={confirmPassword}
            onChangeText={setconfirmPassword}
          />
        </View>

        <View style={styles.infoMain}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: height * 0.01,
              right: width * 0.03,
            }}
          >
            <Text style={[styles.infoText, { top: height * 0.045 }]}>.</Text>
            <Text style={styles.infoTextSec}>
              At least 12 characters long but 14 or more is better.
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: height * 0.01,
              right: width * 0.03,
            }}
          >
            <Text style={[styles.infoText, { top: height * 0.033 }]}>.</Text>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.infoTextSec}>
                A combination of uppercase letters, lowercase letters,
              </Text>
              <Text style={styles.infoTextSec}>numbers, and symbols.</Text>
            </View>
          </View>
        </View>

        <View style={styles.btnMain}>
          <CustomButton
            text="Change Password"
            textColor={colors.white}
            btnHeight={height * 0.065}
            btnWidth={width * 0.85}
            backgroundColor={colors.lightbrown}
            borderRadius={20}
        //   onPress={resetPassword}
          onPress={() => navigation.goBack()}
          />
        </View>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              width: width * 0.8,
              paddingVertical: height * 0.04,
              borderRadius: 40,
              alignItems: 'center',
            }}
          >
            <Image source={images.sucess} />

            <Text
              style={{
                fontFamily: fontFamily.GilroyBold,
                fontSize: fontSizes.md,
                color: colors.black,
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              Password Successfully{'\n'}Changed
            </Text>

            <View style={{ top: height * 0.02 }}>
              <CustomButton
                text="Okay"
                textColor={colors.white}
                btnHeight={height * 0.06}
                btnWidth={width * 0.6}
                backgroundColor={colors.marhoon}
                borderRadius={30}
                onPress={toggleModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    top: Platform.OS === 'ios' ? height * 0.05 : height * 0.001
  },
  textMain: {
    alignItems: 'center',
    top: height * 0.025,
  },
  text: {
    fontFamily: fontFamily.GilroyBold,
    fontSize: fontSizes.sm,
    color: colors.black,
    right: width * 0.26,
    top: height * 0.04,
  },
  inputMain: {
    alignItems: 'center',
    gap: height * 0.02,
    top: height * 0.05,
  },
  inputContainer: {
    alignItems: 'center',
    gap: height * 0.05,
    top: height * 0.01,
  },
  infoMain: {
    top: height * 0.02,
    gap: height * 0.01,
  },
  infoText: {
    fontFamily: fontFamily.RubikBold,
    fontSize: fontSizes.md,
    color: colors.black,
    bottom: height * 0.004,
  },
  infoTextSec: {
    fontFamily: fontFamily.GilroyRegular,
    fontSize: fontSizes.xsm,
    color: colors.black,
    top: height * 0.05,
  },
  btnMain: {
    top: Platform.OS === 'ios' ? height * 0.45 : height * 0.5,
  },
  topHeader: {
    // backgroundColor: colors.white,
    height: height * 0.1,
  },
});

export default ChangePassword;
