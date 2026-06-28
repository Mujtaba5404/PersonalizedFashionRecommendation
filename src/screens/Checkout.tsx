import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import TopHeader from '../components/Topheader';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearCart, removeFromCart } from '../redux/slice/cartSlice';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import { DeliveryAddress } from './AddDeliveryAddress';

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

// Builds a single-line delivery address string from a saved address object.
const formatAddress = (address: DeliveryAddress | null): string => {
  if (!address) return '';
  return [
    address.completeAddress,
    address.areaCode,
    address.city,
    address.province,
  ]
    .filter(Boolean)
    .join(', ');
};

type CheckoutRoute = {
  Checkout: { address?: DeliveryAddress } | undefined;
};

const Checkout = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<CheckoutRoute, 'Checkout'>>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [address, setAddress] = useState<DeliveryAddress | null>(null);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const itemsTotal = items.reduce(
    (sum, i) => sum + parsePrice(i.price) * i.quantity,
    0,
  );
  const currencyPrefix = items[0]?.price?.includes('$') ? '$' : 'Rs. ';

  const paymentMethod = 'cash';
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

  const handlePlaceOrder = async () => {
    if (placing) return;

    const deliveryAddress = formatAddress(address);

    if (deliveryType === 'delivery' && !deliveryAddress) {
      Toast.show({
        type: 'error',
        text1: 'Address required',
        text2: 'Please add a delivery address.',
      });
      return;
    }

    setPlacing(true);

    // Finalize the order on the backend (cash on delivery / pickup).
    const { error } = await apiHelper('POST', 'payment/checkout', {}, {}, {
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
    });
    setPlacing(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Checkout failed',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    dispatch(clearCart());
    Toast.show({
      type: 'success',
      text1: 'Order placed',
      text2: 'Your order has been placed successfully.',
    });
    navigation.navigate('OrderSuccess');
  };

  return (
    <View style={styles.container}>
      <TopHeader isBack text="Checkout" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* DELIVERY TYPE */}
        <View style={styles.typeRow}>
          <View style={styles.typeOption}>
            <BouncyCheckbox
              size={24}
              fillColor={colors.brown}
              unFillColor={colors.white}
              isChecked={deliveryType === 'delivery'}
              useBuiltInState={false}
              disableText
              iconStyle={{ borderColor: colors.brown, borderWidth: 2, borderRadius: 8 }}
              innerIconStyle={{ borderRadius: 8 }}
              onPress={() => setDeliveryType('delivery')}
            />
            <Text style={styles.typeText}>Delivery</Text>
          </View>

          <View style={styles.typeOption}>
            <BouncyCheckbox
              size={24}
              fillColor={colors.brown}
              unFillColor={colors.white}
              isChecked={deliveryType === 'pickup'}
              useBuiltInState={false}
              disableText
              iconStyle={{ borderColor: colors.brown, borderWidth: 2, borderRadius: 8 }}
              innerIconStyle={{ borderRadius: 8 }}
              onPress={() => setDeliveryType('pickup')}
            />
            <Text style={styles.typeText}>Pickup</Text>
          </View>
        </View>

        {/* DELIVERY ADDRESS */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.sectionSubtitle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </Text>

        {address ? (
          <View style={styles.addressCard}>
            <View style={styles.addressTopRow}>
              <View style={styles.addressNameRow}>
                <Text style={styles.addressName}>{address.fullName}</Text>
                <View style={styles.addressLabelChip}>
                  <Text style={styles.addressLabelText}>{address.label}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('AddDeliveryAddress', { address })
                }
              >
                <Icon name="pencil" size={width * 0.045} color={colors.white} />
              </TouchableOpacity>
            </View>

            <Text style={styles.addressLine}>
              {address.countryCode} {address.phone}
            </Text>
            {!!(address.city || address.province) && (
              <Text style={styles.addressLine}>
                {[address.city, address.province].filter(Boolean).join(', ')}
              </Text>
            )}
            {!!address.areaCode && (
              <Text style={styles.addressLine}>{address.areaCode}</Text>
            )}
            <Text style={styles.addressLine}>{address.completeAddress}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addAddress}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddDeliveryAddress')}
          >
            <Text style={styles.addAddressText}>Add Delivery Address</Text>
            <View style={styles.plusButton}>
              <Image source={images.plus} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
            </View>
          </TouchableOpacity>
        )}

        {/* ORDER DETAILS */}
        <Text style={[styles.sectionTitle, { marginTop: height * 0.035 }]}>Order Details</Text>
        <Text style={styles.sectionSubtitle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </Text>

        {items.map(item => (
          <View
            key={`${item.productId}-${item.size}`}
            style={[styles.orderItem, { marginBottom: height * 0.015 }]}
          >
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
                  <Image source={images.Remove} style={styles.removeIcon} />
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

        {/* ORDER SUMMARY */}
        <Text style={[styles.sectionTitle, { marginTop: height * 0.03 }]}>Order Summary</Text>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items Total</Text>
            <Text style={styles.summaryValue}>
              {currencyPrefix}
              {formatAmount(itemsTotal)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total Payment</Text>
            <Text style={styles.summaryTotalValue}>
              {currencyPrefix}
              {formatAmount(itemsTotal)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + height * 0.02 }]}>
        <Text style={styles.paymentTitle}>Select Payment Method</Text>

        {/* Cash only */}
        <View style={styles.methodRow}>
          <View style={[styles.methodChip, styles.methodChipActive]}>
            <Text style={[styles.methodText, styles.methodTextActive]}>
              Cash
            </Text>
          </View>
        </View>

        <View style={styles.footerBottom}>
          <View>
            <Text style={styles.totalItems}>Total {totalQuantity} items</Text>
            <Text style={styles.totalPrice}>
              {currencyPrefix}
              {formatAmount(itemsTotal)}
            </Text>
          </View>
          <CustomButton
            text={placing ? 'Placing...' : 'Place Order'}
            textColor={colors.white}
            backgroundColor={colors.lightbrown}
            borderRadius={20}
            btnWidth={width * 0.42}
            btnHeight={height * 0.07}
            fontSize={fontSizes.md}
            onPress={handlePlaceOrder}
          />
        </View>
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
    paddingBottom: height * 0.42,
  },

  // Delivery type
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.03,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.08,
  },
  typeText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
    paddingHorizontal: width * 0.02,
  },

  // Sections
  sectionTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    marginBottom: height * 0.008,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm2,
    color: '#7A7A7A',
    marginBottom: height * 0.02,
  },

  // Saved address card
  addressCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 18,
    padding: width * 0.05,
  },
  addressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.012,
  },
  addressNameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  addressName: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  addressLabelChip: {
    backgroundColor: colors.lightbrown,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.005,
  },
  addressLabelText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  editButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: colors.lightbrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressLine: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: '#3D3D3D',
    marginTop: height * 0.006,
  },

  // Add address
  addAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.03,
    paddingVertical: width * 0.03,
  },
  addAddressText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  plusButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 16,
    backgroundColor: '#E8DDDC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Order item
  orderItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: width * 0.03,
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
  removeIcon: {
    width: 25,
    height: 30,
    resizeMode: 'contain',
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

  // Summary
  summaryBox: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    marginTop: height * 0.005,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.009,
  },
  summaryLabel: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: '#3D3D3D',
  },
  summaryValue: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: '#3D3D3D',
  },
  summaryTotalLabel: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  summaryTotalValue: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.025,
  },
  paymentTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginBottom: height * 0.018,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.018,
    marginBottom: height * 0.025,
  },
  cardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.11,
  },
  cardCircle: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.03,
  },
  cardCircleOverlap: {
    marginLeft: -width * 0.025,
    opacity: 0.9,
  },
  cardInfo: {
    flex: 1,
    marginLeft: width * 0.02,
  },
  cardLabel: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  cardNumberText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
    color: '#9E9E9E',
    letterSpacing: 2,
    marginTop: height * 0.004,
  },

  // Card / Cash method chips
  methodRow: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },
  methodChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.02,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: height * 0.016,
    borderWidth: 1.5,
    borderColor: '#E4E4E4',
    marginRight: width * 0.04,
  },
  methodChipActive: {
    backgroundColor: colors.lightbrown,
    borderColor: colors.lightbrown,
  },
  methodText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  methodTextActive: {
    color: colors.white,
  },
  footerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export default Checkout;
