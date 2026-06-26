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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { removeFromCart } from '../redux/slice/cartSlice';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import TopHeader from '../components/Topheader';

// Pulls the numeric value out of a formatted price string like "Rs. 37,219.00".
// Strips thousands-separator commas, then grabs the first number run so a
// currency prefix such as "Rs." (which contains a dot) can't corrupt parsing.
const parsePrice = (price: string) => {
  const match = String(price).replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

// Formats a whole-rupee amount with thousands separators, e.g. 37219 -> "37,219".
const formatAmount = (value: number) => {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Cart = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const [coupon, setCoupon] = useState('');

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + parsePrice(i.price) * i.quantity,
    0,
  );
  const currencyPrefix = items[0]?.price?.includes('$') ? '$' : 'Rs. ';

  return (
    <View style={styles.container}>
      <TopHeader isBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        ) : (
          <>
            {/* CART ITEMS */}
            {items.map(item => (
              <View key={`${item.productId}-${item.size}`} style={styles.cartItem}>
                <Image source={item.image} style={styles.itemImage} />

                <View style={styles.itemInfo}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        dispatch(
                          removeFromCart({
                            productId: item.productId,
                            size: item.size,
                          }),
                        )
                      }
                    >
                      <Image
                        source={images.Remove}
                        style={{ width: 25, height: 30 }}
                      />
                    </TouchableOpacity>
                  </View>
                  {item.description ? (
                    <Text style={styles.itemDesc} numberOfLines={1}>
                      {item.description}
                    </Text>
                  ) : null}
                  <Text style={styles.itemStock}>
                    Size: {item.size}  •  Qty: {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
              </View>
            ))}

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
          </>
        )}
      </ScrollView>

      {/* FOOTER */}
      {items.length > 0 && (
        <View
          style={[styles.footer, { paddingBottom: insets.bottom + height * 0.02 }]}
        >
          <View>
            <Text style={styles.totalItems}>Total {totalQuantity} items</Text>
            <Text style={styles.totalPrice}>
              {currencyPrefix}
              {formatAmount(totalAmount)}
            </Text>
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
      )}
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

  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: '#7A7A7A',
    textAlign: 'center',
    marginTop: height * 0.3,
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
