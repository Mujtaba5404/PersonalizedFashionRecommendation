import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { MainStackParamList } from '../navigation/MainStack';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

// type Props = NativeStackScreenProps<StackParamList, 'Onboarding'>;

const SignInEmail = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ImageBackground
      source={images.Background}
      style={styles.imgbg}
      >
        <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image source={images.Logo} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome back</Text>
          <View style={styles.inputMain}>
            <CustomTextInput
              placeholder="Email Address"
              placeholderTextColor={colors.black}
              inputHeight={height * 0.06}
              inputWidth={width * 0.85}
              backgroundColor={colors.lightGray}
              borderRadius={20}
              onChangeText={setEmail}
              keyboardType='email-address'
            />
            <CustomTextInput
              placeholder="Password"
              placeholderTextColor={colors.black}
              inputHeight={height * 0.06}
              inputWidth={width * 0.85}
              backgroundColor={colors.lightGray}
              borderRadius={20}
              isPassword={true}
              value={password}
              onChangeText={setPassword}
              keyboardType='default'
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.forgotPassMain}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPass}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center', top: height * 0.04 }}>
              <CustomButton
                btnHeight={height * 0.06}
                btnWidth={width * 0.85}
                text="Login"
                backgroundColor={colors.lightbrown}
                textColor={colors.white}
                borderRadius={20}
                onPress={() => navigation.navigate('Home')}
              />
            </View>
          </View>
          <View style={styles.belowMain}>
            <Image source={images.continue} style={styles.continueImg} />

            <View style={{flexDirection:'row', alignSelf:'center'}}>
            <TouchableOpacity style={styles.socialMain}>
              <Image source={images.googleIcon} style={styles.scialImg} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialMain}>
              <Image source={images.appleIcon} style={styles.scialImg} />
            </TouchableOpacity>
            </View>

            <View style={styles.memberMain}>
              <Text style={styles.memberText}>Not a member?</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Registeration')}
              >
                <Text style={styles.signUpText}>Sign up now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.35,
    height: height * 0.2,
    resizeMode: 'contain',
    top: height * 0.05,
  },
  welcomeText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    top: height * 0.08,
  },
  inputMain: {
    marginTop: height * 0.12,
    gap: height * 0.01,
    borderRadius: 25,
  },
  forgotPassMain: {
    alignSelf: 'flex-end',
    width: width * 0.29,
    cursor: 'pointer',
  },
  forgotPass: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.black,
    top: height * 0.01,
  },
  belowMain: {
    marginTop: height * 0.03,
  },
  continueImg: {
    width: width * 0.8,
    height: height * 0.15,
    resizeMode: 'contain',
  },
  socialMain: {
    flexDirection: 'row',
    justifyContent: "center"
  },
  scialImg: {
    width: width * 0.25,
    height: height * 0.1,
    resizeMode: 'contain',
  },
  memberMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: height * 0.05,
    gap: width * 0.01,
  },
  memberText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
    color: colors.black,
  },
  signUpText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
    color: colors.brown,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
    imgbg:{
    alignSelf: 'center',
    width: width * 0.99,
    height: height * 0.9999,
  }
});

export default SignInEmail;
