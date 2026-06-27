import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import TopHeader from '../components/Topheader';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  read: boolean;
};

// Maps a raw /payment/notifications item to the UI's NotificationItem shape.
const mapNotification = (raw: any, index: number): NotificationItem => ({
  id: String(raw?.id ?? raw?.notification_id ?? index),
  title: raw?.title || raw?.heading || 'Notification',
  message: raw?.message || raw?.body || raw?.description || '',
  read: Boolean(raw?.is_read ?? raw?.read ?? false),
});

const NotificationsScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { response, error } = await apiHelper('GET', 'payment/notifications');
    setLoading(false);

    if (error) {
      setNotifications([]);
      Toast.show({
        type: 'error',
        text1: 'Failed to load notifications',
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
      : data?.results || data?.notifications || data?.data || [];

    setNotifications(list.map(mapNotification));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications]),
  );

  const handleReadAll = async () => {
    if (markingAll) return;

    setMarkingAll(true);
    const { error } = await apiHelper('PUT', 'payment/notifications/read-all');
    setMarkingAll(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not mark all as read',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    Toast.show({
      type: 'success',
      text1: 'Done',
      text2: 'All notifications marked as read.',
    });
  };

  const handlePress = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const unread = !item.read;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handlePress(item.id)}
        style={[styles.card, unread ? styles.cardUnread : styles.cardRead]}
      >
        <View style={[styles.iconCircle, unread && styles.iconCircleUnread]}>
          <Image source={images.notification} style={styles.bellIcon} />
        </View>

        <View style={styles.textWrap}>
          <Text
            style={[styles.title, unread ? styles.textOnBrown : styles.titleRead]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.message,
              unread ? styles.textOnBrown : styles.messageRead,
            ]}
            numberOfLines={2}
          >
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={images.Background} style={styles.imgbg}>
      <SafeAreaView style={styles.flex}>
        {/* Header */}
        <View style={styles.header}>
          <TopHeader isBack={true} />

          <Text style={styles.headerTitle}>Notifications</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReadAll}
            disabled={markingAll}
          >
            <Text style={styles.readAll}>
              {markingAll ? 'Reading...' : 'Read All'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && notifications.length === 0 ? (
          <ActivityIndicator
            size="large"
            color={colors.lightbrown}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onRefresh={fetchNotifications}
            refreshing={loading}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No notifications yet.</Text>
            }
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgbg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
  },
  backButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: width * 0.05,
    height: width * 0.05,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  readAll: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
    color: '#9A9A9A',
  },
  listContent: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.04,
    gap: height * 0.018,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  cardUnread: {
    backgroundColor: colors.lightbrown,
  },
  cardRead: {
    backgroundColor: '#F0EFEF',
  },
  iconCircle: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: '#E2E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.035,
  },
  iconCircleUnread: {
    backgroundColor: colors.white,
  },
  bellIcon: {
    width: width * 0.055,
    height: width * 0.055,
    resizeMode: 'contain',
    tintColor: colors.lightbrown,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    marginBottom: height * 0.004,
  },
  titleRead: {
    color: colors.black,
  },
  message: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
  },
  messageRead: {
    color: '#8A8A8A',
  },
  textOnBrown: {
    color: colors.white,
  },
  loader: {
    marginTop: height * 0.04,
  },
  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: height * 0.06,
  },
});

export default NotificationsScreen;
