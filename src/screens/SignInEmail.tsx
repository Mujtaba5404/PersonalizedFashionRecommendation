import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { MainStackParamList } from '../navigation/MainStack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser, setUserAuthToken } from '../redux/slice/roleSlice';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

// type Props = NativeStackScreenProps<StackParamList, 'Onboarding'>;

const SignInEmail = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();
  const storedUser = useAppSelector(state => state.role.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [loading, setLoading] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  const handleLogin = async () => {
    if (loading) return;

    if (!email.includes('@') || password.trim().length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid details',
        text2: 'Please enter a valid email and password.',
      });
      return;
    }

    setLoading(true);
    const { response, error } = await apiHelper('POST', 'login', {}, {}, {
      email: email.trim(),
      password: password,
    });
    setLoading(false);

    if (response?.data?.access_token) {
      dispatch(setUserAuthToken(response.data.access_token));
      // The login response carries no profile. If the persisted user is the same
      // person logging in (matching email), keep their stored name/image;
      // otherwise it's stale data from another account, so reset to just the email.
      const loggedInEmail = email.trim();
      const isSameUser =
        storedUser?.email?.toLowerCase() === loggedInEmail.toLowerCase();
      dispatch(
        setUser(
          isSameUser
            ? { ...storedUser, email: loggedInEmail }
            : { email: loggedInEmail },
        ),
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged in successfully.',
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        }),
      );
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: typeof error === 'string' ? error : 'Invalid email or password.',
      });
    }
  };

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
                value={email}
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
                  text={loading ? 'Logging in...' : 'Login'}
                  backgroundColor={colors.lightbrown}
                  textColor={colors.white}
                  borderRadius={20}
                  disabled={loading}
                  onPress={handleLogin}
                />
              </View>
            </View>
            <View style={styles.belowMain}>
              <Image source={images.continue} style={styles.continueImg} />

              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity style={styles.socialMain}>
                  <Image source={images.googleIcon} style={styles.scialImg} />
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
  imgbg: {
    alignSelf: 'center',
    width: width * 0.99,
    height: height * 0.9999,
  }
});

export default SignInEmail;
