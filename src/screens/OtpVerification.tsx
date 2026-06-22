import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import CustomButton from '../components/CustomButton';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import images from '../assets/Images';


const OtpVerification = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const params = (route.params ?? {}) as any;
  const from = params.from;
  const phoneNumber = params.phone_number;


  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleResend = async () => {
  if (resending) return;

  setResending(true);
  const { response, error } = await apiHelper('POST', 'resend-otp', {}, {}, {
    phone_number: phoneNumber,
  });
  setResending(false);

  if (response) {
    setTimer(response.data?.seconds_until_resend || 60);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    Toast.show({
      type: 'success',
      text1: 'OTP sent',
      text2: response.data?.message ?? 'A new OTP has been sent.',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Could not resend',
      text2: typeof error === 'string' ? error : 'Failed to resend OTP. Please try again.',
    });
  }
};

const handleContinue = async () => {
  if (loading) return;

  const otpCode = otp.join('');
  if (otpCode.length < OTP_LENGTH) {
    Toast.show({
      type: 'error',
      text1: 'Invalid OTP',
      text2: `Please enter the ${OTP_LENGTH}-digit code.`,
    });
    return;
  }

  setLoading(true);
  const { response, error } = await apiHelper('POST', 'verify-otp', {}, {}, {
    phone_number: phoneNumber,
    otp_code: otpCode,
  });
  setLoading(false);

  if (response) {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: response.data?.message ?? 'OTP verified successfully.',
    });
    if (from === 'Register') {
      navigation.navigate('CreateProfile');
    } else if (from === 'ForgotPassword') {
      navigation.navigate('SignInEmail');
    }
  } else {
    Toast.show({
      type: 'error',
      text1: 'Verification failed',
      text2: typeof error === 'string' ? error : 'Invalid or expired OTP. Please try again.',
    });
  }
};


  return (
    <ImageBackground
    source={images.Background}
    style={styles.imgbg}
    >
      <TopHeader text="OTP Verification" isBack={true} />

      {/* Info text */}
      <View style={{ top: height * 0.04 }}>
        <Text style={styles.otp}>
          Please enter 6-digit code we have sent you
        </Text>
        <Text style={styles.otp}>on your Phone Number</Text>
      </View>

      <View style={styles.otpContainer}>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref!)}
            style={[
              styles.otpBox,
              {
                borderColor: focusedIndex === index ? colors.brown : colors.lightGray,
                backgroundColor: focusedIndex === index ? colors.lightGray : colors.lightGray,
              },
            ]}
            value={otp[index] || ''} // access string by index
            onChangeText={text => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
          />
        ))}
      </View>


      {/* Resend */}
      <TouchableOpacity
        onPress={handleResend}
        disabled={timer > 0 || resending}
        style={styles.resendButton}
      >
        <Text style={styles.resendText}>
          {resending
            ? 'Sending...'
            : timer > 0
            ? `Resend in 00:${timer < 10 ? `0${timer}` : timer}`
            : 'Resend Code'}
        </Text>
      </TouchableOpacity>

      <View style={styles.btnMain}>
        <CustomButton
          btnHeight={height * 0.06}
          btnWidth={width * 0.85}
          borderRadius={20}
          backgroundColor={colors.lightbrown}
          text={loading ? 'Verifying...' : 'Continue'}
          textColor={colors.white}
          disabled={loading}
          onPress={handleContinue}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  otp: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm2,
    alignSelf: 'center',
    color: colors.black,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.05,
  },
  otpBox: {
    width: width * 0.12,
    height: height * 0.07,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    textAlign: 'center',
    fontSize: fontSizes.lg,
    fontFamily: fontFamily.Rubikregular,
    marginHorizontal: 5,
    color: colors.black,
    top: height * 0.15,
  },
  resendButton: {
    top: height * 0.2,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.brown,
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 14,
  },
  resendText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
    color: colors.marhoon,
  },
  btnMain: {
    top: height * 0.55,
    alignItems: 'center',
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

export default OtpVerification;
