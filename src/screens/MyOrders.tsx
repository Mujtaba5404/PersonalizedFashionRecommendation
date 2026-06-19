import { useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import OrderDetailsSheet from '../components/OrderDetailsSheet';
import TopHeader from '../components/Topheader';
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
  tab: OrderTab;
};

const ordersData: Order[] = [
  {
    id: 1,
    image: images.Heel,
    title: 'Dummy Text',
    status: 'Pickup',
    qty: 1,
    deliveryDate: '25 Oct - 27 Oct',
    price: '$12.56',
    tab: 'Pending',
  },
  {
    id: 2,
    image: images.product2,
    title: 'Dummy Text',
    status: 'Pickup',
    qty: 1,
    deliveryDate: '25 Oct - 27 Oct',
    price: '$12.56',
    tab: 'Pending',
  },
  {
    id: 3,
    image: images.product1,
    title: 'Dummy Text',
    status: 'Delivered',
    qty: 1,
    deliveryDate: '25 Oct',
    price: '$12.56',
    tab: 'Delivered',
  },
];

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>('Pending');
  const [detailsVisible, setDetailsVisible] = useState(false);

  const visibleOrders = ordersData.filter(order => order.tab === activeTab);

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
        {visibleOrders.map(order => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={order.image} style={styles.productImage} />

              <View style={styles.cardInfo}>
                <View style={styles.statusBadge}>
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
              onPress={() => setDetailsVisible(true)}
            >
              <Text style={styles.detailsButtonText}>Order Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <OrderDetailsSheet
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        variant={activeTab === 'Delivered' ? 'delivery' : 'pickup'}
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
});

export default MyOrders;
