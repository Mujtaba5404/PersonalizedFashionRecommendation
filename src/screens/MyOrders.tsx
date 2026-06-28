import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import OrderDetailsSheet from '../components/OrderDetailsSheet';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

type OrderTab = 'Pending' | 'Delivered';

type Order = {
  id: number;
  image: ImageSourcePropType;
  title: string;
  status: string;
  qty: number;
  deliveryDate: string;
  price: string;
  totalAmount: number;
  createdAt: string;
  deliveryAddress: string;
};

// Maps a raw /payment/my-orders item to the UI's Order shape, tolerating the
// various field names the backend may use.
const mapOrder = (raw: any, index: number): Order => {
  const imageUrl = String(raw?.image_url || raw?.image || '');
  const isRemote = /^https?:\/\//i.test(imageUrl);
  const price = raw?.price ?? raw?.total_amount ?? raw?.total;
  const totalAmount = Number(raw?.total_amount ?? raw?.price ?? raw?.total ?? 0);

  return {
    id: Number(raw?.id ?? raw?.order_id ?? index),
    image: isRemote ? { uri: imageUrl } : images.Heel,
    title: raw?.product_name || raw?.title || raw?.name || 'Order',
    status: raw?.status || raw?.order_status || '',
    qty: Number(raw?.quantity ?? raw?.qty ?? raw?.items?.length ?? 1),
    deliveryDate: raw?.delivery_date || raw?.deliveryDate || '',
    price: price != null ? `Rs. ${price}` : '',
    totalAmount: isNaN(totalAmount) ? 0 : totalAmount,
    createdAt: raw?.created_at || raw?.createdAt || '',
    deliveryAddress: raw?.delivery_address || raw?.deliveryAddress || '',
  };
};

const MyOrders = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<OrderTab>('Pending');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [delivering, setDelivering] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { response, error } = await apiHelper('GET', 'payment/my-orders', {
      status: activeTab.toLowerCase(),
    });
    setLoading(false);

    if (error) {
      setOrders([]);
      Toast.show({
        type: 'error',
        text1: 'Failed to load orders',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    const data = response?.data;
    console.log('Fetched orders:', data);
    const list: any[] = Array.isArray(data)
      ? data
      : data?.results || data?.orders || data?.data || [];

    setOrders(list.map(mapOrder));

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Orders fetched successfully.',
    });
  }, [activeTab]);

  // Refetch on focus and whenever the active tab (status filter) changes.
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const markDelivered = async () => {
    if (delivering || !selectedOrder) return;

    setDelivering(true);
    const { response, error } = await apiHelper(
      'PUT',
      `payment/${selectedOrder.id}/status`,
      { new_status: 'Delivered' },
    );
    setDelivering(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update order',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    setDetailsVisible(false);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: response?.data?.message || 'Order status changed to Delivered.',
    });
    fetchOrders();
  };

  return (
    <ImageBackground
      source={images.Background}
      style={styles.imgbg}
      resizeMode="cover"
    >
      <TopHeader text="My Orders" isBack={true} />

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['Pending', 'Delivered'] as OrderTab[]).map(tab => {
          const active = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, active && styles.tabActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.lightbrown}
            style={styles.loader}
          />
        ) : orders.length === 0 ? (
          <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders.</Text>
        ) : (
          orders.map(order => (
            <View key={order.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Image source={order.image} style={styles.productImage} />

                <View style={styles.cardInfo}>
                  <View
                    style={[
                      styles.statusBadge,
                      order.status.toLowerCase() === 'delivered' &&
                        styles.statusBadgeDelivered,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      Order Status: {order.status}
                    </Text>
                  </View>
                  <Text style={styles.productTitle}>{order.title}</Text>
                  <Text style={styles.metaText}>Qty: {order.qty}</Text>
                  <Text style={styles.metaText}>
                    Delivery date:{' '}
                    <Text style={styles.deliveryDate}>{order.deliveryDate}</Text>
                  </Text>
                </View>

                <Text style={styles.price}>{order.price}</Text>
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedOrder(order);
                  setDetailsVisible(true);
                }}
              >
                <Text style={styles.detailsButtonText}>Order Details</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <OrderDetailsSheet
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        variant={activeTab === 'Delivered' ? 'delivery' : 'pickup'}
        order={selectedOrder}
        delivering={delivering}
        onDeliver={markDelivered}
        onHelp={() => {
          setDetailsVisible(false);
          navigation.navigate('CustomerSupport');
        }}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgbg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.gray,
    borderRadius: 30,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
    padding: width * 0.012,
  },
  tab: {
    flex: 1,
    paddingVertical: height * 0.018,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.lightbrown,
  },
  tabText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  tabTextActive: {
    color: colors.white,
  },

  // List
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.05,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productImage: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  cardInfo: {
    flex: 1,
    marginLeft: width * 0.03,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4493D',
    borderRadius: 30,
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.008,
  },
  statusBadgeDelivered: {
    backgroundColor: '#4CAF50',
  },
  statusBadgeText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.xsm,
    color: colors.white,
  },
  productTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
    marginBottom: height * 0.004,
  },
  metaText: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm2,
    color: colors.black,
    marginTop: height * 0.002,
  },
  deliveryDate: {
    fontFamily: fontFamily.UrbanistBold,
    color: '#F4493D',
  },
  price: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.lightbrown,
    marginLeft: width * 0.02,
  },
  detailsButton: {
    backgroundColor: colors.lightbrown,
    borderRadius: 30,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.015,
  },
  detailsButtonText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.white,
  },
  loader: {
    marginTop: height * 0.3,
  },
  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
    textAlign: 'center',
    marginTop: height * 0.3,
  },
});

export default MyOrders;
