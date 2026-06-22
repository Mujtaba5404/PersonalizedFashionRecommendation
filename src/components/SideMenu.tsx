import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import { useAppSelector } from '../redux/hooks';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

const PANEL_WIDTH = width * 0.8;

type MenuItem = {
  label: string;
  route?: string;
};

const menuItems: MenuItem[] = [
  { label: 'Home', route: 'Home' },
  { label: 'My Orders', route: 'MyOrders' },
  { label: 'Orders History', route: 'OrdersHistory' },
  { label: 'Get Help', route: 'CustomerSupport' },
  { label: 'Payment Methods', route: 'PaymentMethods' },
];

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const user = useAppSelector(state => state.role.user);
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateX]);

  const handleClose = (after?: () => void) => {
    Animated.timing(translateX, {
      toValue: -PANEL_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      after?.();
    });
  };

  const handleNavigate = (route?: string) => {
    handleClose(route ? () => navigation.navigate(route) : undefined);
  };

  const handleLogout = () => {
    handleClose(() =>
      navigation.reset({ index: 0, routes: [{ name: 'Register' }] }),
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => handleClose()}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          {/* HEADER */}
          <View style={[styles.header, { paddingTop: insets.top + height * 0.02 }]}>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={() => handleClose()}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>

            <View style={styles.profileRow}>
              <Image
                source={user?.image ? { uri: String(user.image) } : images.profileImage}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.name?.trim() || 'Guest User'}
                </Text>
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user?.email || 'No email available'}
                </Text>
              </View>
            </View>
          </View>

          {/* MENU ITEMS */}
          <View style={styles.body}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleNavigate(item.route)}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* LOGOUT */}
          <TouchableOpacity
            style={[styles.logoutButton, { marginBottom: insets.bottom + height * 0.02 }]}
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
            <Icon name="log-out-outline" size={width * 0.06} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>

        {/* BACKDROP */}
        <Pressable style={styles.backdrop} onPress={() => handleClose()} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    width: PANEL_WIDTH,
    height: '100%',
    backgroundColor: colors.white,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // Header
  header: {
    backgroundColor: colors.lightbrown,
    borderBottomRightRadius: 30,
    paddingHorizontal: width * 0.06,
    paddingBottom: height * 0.03,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: width * 0.09,
    height: width * 0.09,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.white,
    fontSize: fontSizes.lg2,
    fontFamily: fontFamily.UrbanistMedium,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.005,
  },
  avatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    resizeMode: 'cover',
  },
  profileInfo: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  profileName: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.white,
    marginBottom: height * 0.004,
  },
  profileEmail: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm2,
    color: colors.white,
    opacity: 0.9,
  },

  // Body
  body: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  menuItem: {
    backgroundColor: '#F4F4F4',
    borderRadius: 30,
    paddingVertical: height * 0.022,
    paddingHorizontal: width * 0.06,
    marginBottom: height * 0.018,
  },
  menuItemText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightbrown,
    borderRadius: 30,
    paddingVertical: height * 0.022,
    paddingHorizontal: width * 0.06,
    marginHorizontal: width * 0.05,
  },
  logoutText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.white,
  },
});

export default SideMenu;
