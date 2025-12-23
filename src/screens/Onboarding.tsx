import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, StyleSheet, Text, View } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import { MainStackParamList } from '../navigation/MainStack';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

// type Props = NativeStackScreenProps<MainStackParamList, 'Register'>;

const Onboarding = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.mainContainer}>
      <Image source={images.Onboarding} style={styles.Img} />
      <View>
        <Text style={styles.welcome}>Welcome to our App</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet consectetur. Vitae etiam lectus
        </Text>
        <Text style={styles.text}>
          venenatis nam amet pellentesque Feugiat at amet ornare
        </Text>
        <Text style={styles.text}>vitae elit gravida.</Text>
      </View>

      <View style={styles.btnMain}>
        <CustomButton
          btnHeight={height * 0.06}
          btnWidth={width * 0.9}
          borderRadius={20}
          backgroundColor={colors.lightbrown}
          text="Continue"
          textColor={colors.white}
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.brown,
    flex: 1,
    alignItems: 'center',
  },
  btnMain: {
    top: height * 0.18,
    alignItems: 'center',
  },
  Img: {
    height: height * 0.6,
    width: width * 0.999,
    bottom: height * 0.03,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  welcome: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.xl,
    color: colors.white,
    alignSelf: 'center',
    top: height * 0.05,
  },
  text: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.white,
    justifyContent: 'center',
    alignSelf: 'center',
    top: height * 0.07,
  },
});

export default Onboarding;
