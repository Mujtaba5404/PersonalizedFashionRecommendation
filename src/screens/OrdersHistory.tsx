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
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

type Order = {
  id: number;
  image: ImageSourcePropType;
  title: string;
  brandName: string;
  status: string;
  qty: number;
  deliveryDate: string;
  price: string;
};

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Formats an ISO date like "2026-06-27T07:19:27" -> "27 Jun".
const formatShortDate = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
};

// Maps a raw /payment/my-orders item to the UI's Order shape.
const mapOrder = (raw: any, index: number): Order => {
  const imageUrl = String(raw?.image_url || raw?.image || '');
  const isRemote = /^https?:\/\//i.test(imageUrl);
  const price = raw?.price ?? raw?.total_amount ?? raw?.total;

  return {
    id: Number(raw?.id ?? raw?.order_id ?? index),
    image: isRemote ? { uri: imageUrl } : images.product1,
    title: raw?.product_name || raw?.title || raw?.name || 'Order',
    brandName:
      raw?.brand_name ||
      raw?.brand ||
      raw?.store_name ||
      raw?.product_name ||
      raw?.title ||
      'Order',
    status: raw?.status || raw?.order_status || 'Delivered',
    qty: Number(raw?.quantity ?? raw?.qty ?? raw?.items?.length ?? 1),
    deliveryDate: formatShortDate(raw?.created_at || raw?.delivery_date),
    price: price != null ? `Rs. ${price}` : '',
  };
};

const OrdersHistory = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { response, error } = await apiHelper('GET', 'payment/my-orders', {
      status: 'delivered',
    });
    setLoading(false);

    if (error) {
      setOrders([]);
      Toast.show({
        type: 'error',
        text1: 'Failed to load history',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    const data = response?.data;
    const list: any[] = Array.isArray(data)
      ? data
      : data?.results || data?.orders || data?.data || [];

    setOrders(list.map(mapOrder));

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Order history fetched successfully.',
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const today = new Date();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const periodLabel = selectedDate
    ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()].slice(0, 3)}`
    : 'Past Week';

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Build the grid: leading null cells for offset, then day numbers
  const firstDayOffset = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const calendarCells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelected = (day: number) =>
    !!selectedDate &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const handleSelectDay = (day: number) => {
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setCalendarVisible(false);
  };

  return (
    <ImageBackground
      source={images.Background}
      style={styles.imgbg}
      resizeMode="cover"
    >
      <TopHeader text="Orders History" isBack={true} />

      {/* Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.periodFilter}
          activeOpacity={0.7}
          onPress={() => setCalendarVisible(true)}
        >
          <Text style={styles.periodText}>{periodLabel}</Text>
          <Image source={images.calender} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.statusFilter} activeOpacity={0.7}>
          <Text style={styles.statusFilterText}>Delivered</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.lightbrown}
            style={styles.loader}
          />
        )}

        {orders.map(order => (
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
                  Delivery date: {order.deliveryDate}
                </Text>
              </View>

              <Text style={styles.price}>{order.price}</Text>
            </View>

            <TouchableOpacity
              style={styles.reviewButton}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('WriteReview', {
                  brandName: order.brandName,
                })
              }
            >
              <Text style={styles.reviewButtonText}>Write a review</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
        statusBarTranslucent
      >
        <Pressable
          style={styles.calendarOverlay}
          onPress={() => setCalendarVisible(false)}
        >
          <Pressable style={styles.calendarCard}>
            {/* Month switcher */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.monthArrow}
                activeOpacity={0.7}
                onPress={goToPrevMonth}
              >

              </TouchableOpacity>

              <Text style={styles.monthTitle}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>

              <TouchableOpacity
                style={styles.monthArrow}
                activeOpacity={0.7}
                onPress={goToNextMonth}
              >
                {/* <Icon name="chevron-forward" size={width * 0.055} color={colors.black} /> */}
              </TouchableOpacity>
            </View>

            {/* Weekday labels */}
            <View style={styles.weekRow}>
              {WEEK_DAYS.map(day => (
                <Text key={day} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Day grid */}
            <View style={styles.daysGrid}>
              {calendarCells.map((day, index) => {
                if (day === null) {
                  return <View key={`empty-${index}`} style={styles.dayCell} />;
                }
                const selected = isSelected(day);
                return (
                  <TouchableOpacity
                    key={day}
                    style={styles.dayCell}
                    activeOpacity={0.7}
                    onPress={() => handleSelectDay(day)}
                  >
                    <View
                      style={[
                        styles.dayInner,
                        selected && styles.dayInnerSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isToday(day) && styles.dayTextToday,
                          selected && styles.dayTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgbg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
    gap: width * 0.03,
  },
  periodFilter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.05,
    gap: width * 0.02,
  },
  periodText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightbrown,
    borderRadius: 30,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    gap: width * 0.01,
  },
  statusFilterText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
    color: colors.white,
  },

  // List
  loader: {
    marginTop: height * 0.3,
  },
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
    backgroundColor: '#7BC043',
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
  price: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.lightbrown,
    marginLeft: width * 0.02,
  },
  reviewButton: {
    backgroundColor: colors.lightbrown,
    borderRadius: 30,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.015,
  },
  reviewButtonText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.white,
  },

  // Calendar modal
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.06,
  },
  calendarCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: width * 0.05,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  monthArrow: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: height * 0.01,
  },
  weekDayText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: colors.lightbrown,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInner: {
    width: '85%',
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInnerSelected: {
    backgroundColor: colors.lightbrown,
  },
  dayText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
    color: colors.black,
  },
  dayTextToday: {
    fontFamily: fontFamily.UrbanistBold,
    color: colors.lightbrown,
  },
  dayTextSelected: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistBold,
  },
});

export default OrdersHistory;
