

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, ImageBackground, SafeAreaView } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import CustomButton from '../components/CustomButton';
import TopHeader from '../components/Topheader';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import { useEffect, useState } from 'react';
import images from '../assets/Images';

const PrivacyPolicy = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [termsData, setTermsData] = useState<any>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={images.Background}
        style={styles.imgbg}
        resizeMode="cover"
      >
        <TopHeader text="Privacy Policy" isBack={true} />

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.textContainer}>

              <Text style={styles.paraText}>
                This Privacy Policy explains how ToneFit AI collects, uses,
                and protects your personal information when you use the
                application. We collect photographs you upload or capture,
                detected skin-tone data, and basic preferences such as
                body fit, occasion, and style choices needed to generate
                recommendations. Purpose of Collection: Your data is used
                only to detect skin tone, recommend suitable outfit colours,
                and display AR try-on previews on your own image. Uploaded
                photographs are processed temporarily to produce recommendations
                and try-on results; they are not used for any unrelated purpose.
              </Text>

              <Text style={styles.paraText}>
                Personal images and results are stored only for as long as
                necessary to provide the service and are removed thereafter
                unless you choose to save them.
              </Text>
            </View>
          </ScrollView>

          {/* <View style={styles.btn}>
            <CustomButton
              btnHeight={height * 0.06}
              btnWidth={width * 0.9}
              borderRadius={20}
              backgroundColor={colors.lightbrown}
              text="I Accept"
              textColor={colors.white}
              onPress={() => navigation.goBack()}
            />
          </View> */}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  imgbg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: height * 0.15, // Space for button
  },
  textContainer: {
    padding: width * 0.05,
    // backgroundColor: colors.white,
    marginHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
  },
  heading: {
    fontFamily: fontFamily.GilroyBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  subheading: {
    fontFamily: fontFamily.GilroySemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
    marginTop: height * 0.025,
    marginBottom: height * 0.01,
  },
  paraText: {
    fontFamily: fontFamily.GilroyRegular,
    fontSize: fontSizes.sm,
    textAlign: 'justify',
    color: colors.black,
    lineHeight: height * 0.024,
    marginBottom: height * 0.015,
  },
  btn: {
    position: 'absolute',
    bottom: height * 0.03,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default PrivacyPolicy;