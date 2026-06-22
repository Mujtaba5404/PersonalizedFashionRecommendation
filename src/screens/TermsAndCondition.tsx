

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

const TermsConditions = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [termsData, setTermsData] = useState<any>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={images.Background}
        style={styles.imgbg}
        resizeMode="cover"
      >
        <TopHeader text="Terms & Conditions" isBack={true} />

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.textContainer}>

              <Text style={styles.paraText}>
                We may update these Terms from time to time.
                We will notify you of material changes through
                the App or by other reasonable means. Your
                continued use after changes take effect constitutes
                acceptance of the revised Terms.
              </Text>

              <Text style={styles.paraText}>
                By downloading, accessing, or using the App, you
                agree to be bound by these Terms. If you do not agree,
                do not use the App.
              </Text>

              {/* Add more sections if needed */}
              <Text style={styles.subheading}>1. Introduction</Text>
              <Text style={styles.paraText}>
                By using ToneFit AI, you agree that the app analyses
                your uploaded photographs and skin-tone data solely
                to generate personalized fashion recommendations and
                AR try-on previews, and that these results are suggestions
                provided "as is" without guarantee of accuracy or fit.
              </Text>

              <Text style={styles.subheading}>2. User Agreement</Text>
              <Text style={styles.paraText}>
                By using ToneFit AI, you agree that the app analyses
                your uploaded photographs and skin-tone data solely
                to generate personalized fashion recommendations and
                AR try-on previews, and that these results are suggestions
                provided "as is" without guarantee of accuracy or fit.
                You confirm that any images you upload are your own and
                that you consent to their temporary processing for this
                purpose. You agree not to misuse, copy, or redistribute
                the app's content, and you accept that ToneFit AI and
                its developers are not liable for purchasing decisions
                made based on its recommendations. Continued use of the
                application constitutes your acceptance of these terms.
              </Text>

              <Text style={styles.subheading}>3. Eligibility & Account</Text>
              <Text style={styles.paraText}>
                You must be at least *[18]* years old. You're responsible
                for keeping your login secure and for all activity under
                your account. We may suspend accounts that violate these
                Terms.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.btn}>
            <CustomButton
              btnHeight={height * 0.06}
              btnWidth={width * 0.9}
              borderRadius={20}
              backgroundColor={colors.lightbrown}
              text="I Accept"
              textColor={colors.white}
              onPress={() => navigation.goBack()}
            />
          </View>
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

export default TermsConditions;