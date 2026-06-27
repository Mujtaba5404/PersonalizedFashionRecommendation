import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import images from '../assets/Images';


const SetNewPassword = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const params = (route.params ?? {}) as any;
  const email = params.email as string | undefined;

  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (loading) return;

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Missing email',
        text2: 'Please restart the password reset from the previous screen.',
      });
      return;
    }

    if (otpCode.trim().length === 0) {
      Toast.show({
        type: 'error',
        text1: 'OTP required',
        text2: 'Please enter the code sent to your email.',
      });
      return;
    }

    if (password.length === 0 || confirmPassword.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Password required',
        text2: 'Please enter and confirm your new password.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        text2: 'Please make sure both passwords are the same.',
      });
      return;
    }

    setLoading(true);
    const { response, error } = await apiHelper('POST', 'reset-password', {}, {}, {
      email: email.trim(),
      otp_code: otpCode.trim(),
      new_password: password,
      confirm_password: confirmPassword,
    });
    setLoading(false);

    if (response) {
      Toast.show({
        type: 'success',
        text1: 'Password reset',
        text2: response.data?.message ?? 'Your password has been reset successfully.',
      });
      navigation.navigate('SignInEmail');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Reset failed',
        text2:
          typeof error === 'string'
            ? error
            : 'Could not reset your password. Please try again.',
      });
    }
  };



  return (
    <ImageBackground
      source={images.Background}
      style={styles.imgbg}
    >
      <TopHeader text="Set New Password" isBack={true} />
      <View style={styles.container}>
        <View style={styles.textMain}>
          <Text style={styles.text}>Please Enter your New Password</Text>
        </View>
        <View style={styles.inputMain}>
          <CustomTextInput
            placeholder="OTP Code"
            placeholderTextColor={colors.black}
            inputHeight={height * 0.06}
            inputWidth={width * 0.85}
            borderRadius={14}
            keyboardType="number-pad"
            value={otpCode}
            onChangeText={setOtpCode}
          />
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
            <Text style={styles.infoText}>.</Text>
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
            <Text style={[styles.infoText, { bottom: height * 0.017 }]}>.</Text>
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
            text={loading ? 'Resetting...' : 'Continue'}
            textColor={colors.white}
            btnHeight={height * 0.065}
            btnWidth={width * 0.85}
            backgroundColor={colors.lightbrown}
            borderRadius={20}
            disabled={loading}
            onPress={handleResetPassword}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    top: height * 0.05,
  },
  textMain: {
    alignItems: 'center',
    bottom: height * 0.03,
  },
  text: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  inputMain: {
    alignItems: 'center',
    gap: height * 0.02,
  },
  infoMain: {
    top: height * 0.02,
    gap: height * 0.02,
    left: width * 0.02,
  },
  infoText: {
    fontFamily: fontFamily.RubikBold,
    fontSize: fontSizes.md,
    color: colors.black,
    bottom: height * 0.004,
  },
  infoTextSec: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  btnMain: {
    top: height * 0.4,
  },
  imgbg: {
    alignSelf: 'center',
    width: width * 0.99,
    height: height * 0.9999,
  }
});

export default SetNewPassword;
