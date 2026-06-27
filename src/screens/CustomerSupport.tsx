import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import TopHeader from '../components/Topheader';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

const CustomerSupport = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const SUPPORT_EMAIL = 'haniamugheez04@gmail.com';

  const handleEmailUs = async () => {
    const subject = encodeURIComponent('Customer Support');
    // Prefer the native Gmail app; fall back to the default mail handler.
    const gmailUrl = `googlegmail:///co?to=${SUPPORT_EMAIL}&subject=${subject}`;
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

    try {
      const canOpenGmail = await Linking.canOpenURL(gmailUrl);
      await Linking.openURL(canOpenGmail ? gmailUrl : mailtoUrl);
    } catch {
      Linking.openURL(mailtoUrl).catch(() => {});
    }
  };

  return (
    <ImageBackground
      source={images.Background}
      style={styles.imgbg}
      resizeMode="cover"
    >
      <TopHeader text="Customer Support" isBack={true} />

      <View style={styles.container}>
        {/* Main illustration */}
        <Image source={images.GetHelp} style={styles.illustration} />

        {/* Title */}
        <Text style={styles.title}>How we can help you?</Text>

        {/* Description */}
        <Text style={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s,
        </Text>

        {/* Email Us card */}
        <TouchableOpacity
          style={styles.emailCard}
          activeOpacity={0.85}
          onPress={handleEmailUs}
        >
          <Image source={images.email} style={{ width: 40, height: 40 }} />
          <Text style={styles.emailText}>Email Us</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgbg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.05,
  },
  illustration: {
    width: width * 0.45,
    height: width * 0.45,
    resizeMode: 'contain',
    marginBottom: height * 0.04,
  },
  title: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  description: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.md,
    color: colors.black,
    textAlign: 'center',
    lineHeight: height * 0.032,
    marginBottom: height * 0.06,
  },
  emailCard: {
    width: width * 0.4,
    aspectRatio: 1,
    backgroundColor: colors.gray,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginTop: height * 0.02,
  },
});

export default CustomerSupport;
