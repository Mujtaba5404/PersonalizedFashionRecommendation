import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import TopHeader from '../components/Topheader';

const Cart = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [coupon, setCoupon] = useState('');

  return (
    <View style={styles.container}>
      <TopHeader isBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CART ITEM */}
        <View style={styles.cartItem}>
          <Image source={images.Heel} style={styles.itemImage} />

          <View style={styles.itemInfo}>
            <View style={styles.itemTopRow}>
              <Text style={styles.itemName}>Dummy Text</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Image source={images.Remove} style={{ width: 25, height: 30 }} />
              </TouchableOpacity>
            </View>
            <Text style={styles.itemDesc} numberOfLines={1}>
              Lorem Ipsum is simply dummy text...
            </Text>
            <Text style={styles.itemStock}>Only 5 Items in stock</Text>
            <Text style={styles.itemPrice}>$4,500</Text>
          </View>
        </View>

        {/* COUPON */}
        <View style={styles.couponContainer}>
          <TextInput
            style={styles.couponInput}
            placeholder="Apply Coupon Code"
            placeholderTextColor={colors.black}
            value={coupon}
            onChangeText={setCoupon}
          />
          <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + height * 0.02 }]}>
        <View>
          <Text style={styles.totalItems}>Total 3 items</Text>
          <Text style={styles.totalPrice}>$4,500</Text>
        </View>
        <CustomButton
          text="Order Now"
          textColor={colors.white}
          backgroundColor={colors.lightbrown}
          borderRadius={20}
          btnWidth={width * 0.42}
          btnHeight={height * 0.07}
          fontSize={fontSizes.md}
          onPress={() => navigation.navigate('Checkout')}
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
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.16,
  },

  // Header
  header: {
    height: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: width * 0.05,
  },
  headerTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },

  // Cart item
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: width * 0.03,
    marginTop: height * 0.015,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImage: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: width * 0.04,
    justifyContent: 'center',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    flex: 1,
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  itemDesc: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm2,
    color: '#6B6B6B',
    marginTop: height * 0.004,
  },
  itemStock: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: '#9E9E9E',
    marginTop: height * 0.01,
  },
  itemPrice: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.lightbrown,
    marginTop: height * 0.004,
  },

  // Coupon
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.02,
    paddingVertical: width * 0.02,
    marginTop: height * 0.03,
  },
  couponInput: {
    flex: 1,
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
    padding: 0,
  },
  applyButton: {
    backgroundColor: colors.black,
    paddingHorizontal: width * 0.07,
    paddingVertical: height * 0.018,
    borderRadius: 20,
  },
  applyText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.white,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
  },
  totalItems: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  totalPrice: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.xl,
    color: colors.black,
  },
});

export default Cart;
