import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import { MainStackParamList } from '../navigation/MainStack';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

// type Props = NativeStackScreenProps<MainStackParamList, 'Registeration'>;

const Register = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <ImageBackground 
    source={images.Background}
    style={styles.imgbg}
    >
      <View>
        <Image source={images.Logo} style={styles.logo} />
      </View>

      <View style={styles.btnMain}>
        <CustomButton
          btnHeight={height * 0.06}
          btnWidth={width * 0.9}
          borderRadius={20}
          backgroundColor={colors.lightbrown}
          text="Register"
          textColor={colors.white}
          onPress={() => navigation.navigate('Registeration')}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          top: height * 0.6,
        }}
      >
        <Text style={styles.member}>Already a member?</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SignInEmail')}
        >
          <Text style={styles.login}> Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    top: height * 0.3,
  },
  btnMain: {
    top: height * 0.55,
    alignItems: 'center',
  },
  member: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
    color: colors.black,
    bottom: height * 0.03
  },
  login: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
    color: colors.brown,
    textDecorationLine: 'underline',
    bottom: height * 0.03
  },
  imgbg:{
    alignSelf: 'center',
    width: width * 0.99,
    height: height * 0.9999,
  }
});

export default Register;
