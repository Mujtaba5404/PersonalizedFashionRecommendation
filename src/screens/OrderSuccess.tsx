import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

const OrderSuccess = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();

  const handleContinueShopping = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleViewOrder = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={images.Checkout} style={styles.image} />
        <Text style={styles.title}>Checkout Successfully</Text>
        <Text style={styles.subtitle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + height * 0.02 }]}>
        <CustomButton
          text="Continue Shopping"
          textColor={colors.lightbrown}
          borderColor={colors.lightbrown}
          borderWidth={1}
          borderRadius={25}
          btnWidth={width * 0.42}
          btnHeight={height * 0.075}
          fontSize={fontSizes.sm2}
          onPress={handleContinueShopping}
        />
        <CustomButton
          text="View Order"
          textColor={colors.white}
          backgroundColor={colors.lightbrown}
          borderRadius={25}
          btnWidth={width * 0.42}
          btnHeight={height * 0.075}
          fontSize={fontSizes.md}
          onPress={handleViewOrder}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
    marginBottom: height * 0.03,
  },
  title: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: width * 0.075,
    color: colors.black,
    textAlign: 'center',
    marginBottom: height * 0.012,
  },
  subtitle: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm2,
    color: '#7A7A7A',
    textAlign: 'center',
    lineHeight: fontSizes.lg,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.025,
  },
});

export default OrderSuccess;
