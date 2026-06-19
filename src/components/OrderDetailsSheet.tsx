import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import images from '../assets/Images';

const ACTIVE = colors.lightbrown;
const TRACK = '#E2E2E2';
const GREEN = '#4CAF50';

type OrderVariant = 'pickup' | 'delivery';

interface OrderDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  variant?: OrderVariant;
}

const SummaryRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && styles.summaryStrong]}>
      {label}
    </Text>
    <Text style={[styles.summaryValue, bold && styles.summaryStrong]}>
      {value}
    </Text>
  </View>
);

const OrderDetailsSheet: React.FC<OrderDetailsSheetProps> = ({
  visible,
  onClose,
  variant = 'pickup',
}) => {
  const isDelivery = variant === 'delivery';

  const HelpButton = () => (
    <TouchableOpacity style={styles.helpButton} activeOpacity={0.8}>
      <View style={styles.helpIcon}>
        <Text style={styles.helpQ}>?</Text>
      </View>
      <Text style={styles.helpText}>Help</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Step indicator */}
            <View style={styles.steps}>
              <View style={styles.step}>
                <View style={[styles.stepCircle, { backgroundColor: ACTIVE }]}>
                  <Icon name="checkmark" size={width * 0.055} color={colors.white} />
                </View>
                <Text style={[styles.stepLabel, { color: ACTIVE }]}>Confirmed</Text>
              </View>

              <View style={[styles.stepLine, { backgroundColor: ACTIVE }]} />

              <View style={styles.step}>
                <View style={[styles.stepCircle, { backgroundColor: ACTIVE }]}>
                  <Icon name="bicycle" size={width * 0.055} color={colors.white} />
                </View>
                <Text style={[styles.stepLabel, { color: ACTIVE }]}>Preparing</Text>
              </View>

              <View style={[styles.stepLine, { backgroundColor: TRACK }]} />

              <View style={styles.step}>
                <View
                  style={[
                    styles.stepCircle,
                    styles.stepCircleDone,
                  ]}
                >
                  <Icon name="checkmark" size={width * 0.055} color={GREEN} />
                </View>
                <Text style={[styles.stepLabel, { color: GREEN }]}>
                  {isDelivery ? 'Arrived' : 'Completed'}
                </Text>
              </View>
            </View>

            {/* Title (+ Help for pickup) */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>Order Details</Text>
              {!isDelivery && <HelpButton />}
            </View>

            {/* Order id + status */}
            <View style={styles.idRow}>
              <Text style={styles.orderId}>#1245325</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {isDelivery ? 'Delivery' : 'Pickup'}
                </Text>
              </View>
            </View>

            <Text style={styles.date}>26 OCT, 2023</Text>

            {isDelivery ? (
              <>
                {/* Address + Help */}
                <View style={styles.addressRow}>
                  <View style={styles.pinRow}>
                    <View style={styles.pinCircle}>
                      <Icon name="location" size={width * 0.045} color={colors.white} />
                    </View>
                    <Text style={styles.inlineAddress}>
                      House # 73 New York, NY 10007, USA
                    </Text>
                  </View>
                  <HelpButton />
                </View>

                {/* Restaurant + phone */}
                <View style={styles.restaurantRow}>
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>Panda Express</Text>
                    <Icon
                      name="information-circle-outline"
                      size={width * 0.05}
                      color={colors.black}
                    />
                  </View>

                  <TouchableOpacity style={styles.phoneButton} activeOpacity={0.85}>
                    <Text style={styles.phoneText}>(917) 365-2318</Text>
                    <Icon
                      name="chatbubble-ellipses"
                      size={width * 0.045}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Pickup location */
              <View style={styles.locationCard}>
                <View style={styles.mapThumb}>
                  <Image source={images.map} />
                </View>

                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle}>Pickup Location</Text>
                  <Text style={styles.locationAddress}>
                    House # 73 New York, NY 10007, USA
                  </Text>
                </View>

                <TouchableOpacity style={styles.directionButton} activeOpacity={0.85}>
                  <Text style={styles.directionText}>Get Direction</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Summary */}
            <View style={styles.summary}>
              <SummaryRow label="Subtotal" value="$59.70" />
              <SummaryRow label="Platform Fee" value="$2.82" />
              <SummaryRow label="GST" value="$5.82" />
              <SummaryRow label="Total" value="$75.37" bold />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: colors.gray,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.015,
    paddingBottom: height * 0.04,
  },
  handle: {
    alignSelf: 'center',
    width: width * 0.12,
    height: height * 0.006,
    borderRadius: 100,
    backgroundColor: '#BDBDBD',
    marginBottom: height * 0.025,
  },

  // Steps
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  step: {
    alignItems: 'center',
    width: width * 0.2,
  },
  stepCircle: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.008,
  },
  stepCircleDone: {
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: GREEN,
  },
  stepLabel: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
  },
  stepLine: {
    flex: 1,
    height: height * 0.005,
    borderRadius: 100,
    marginBottom: height * 0.03,
  },

  // Title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  title: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.xl,
    color: colors.black,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 30,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.04,
    gap: width * 0.02,
  },
  helpIcon: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.025,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpQ: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.xsm,
  },
  helpText: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
  },

  // Order id
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
    marginBottom: height * 0.015,
  },
  orderId: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: ACTIVE,
  },
  statusBadge: {
    backgroundColor: ACTIVE,
    borderRadius: 30,
    paddingVertical: height * 0.006,
    paddingHorizontal: width * 0.04,
  },
  statusBadgeText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm2,
    color: colors.white,
  },
  date: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    marginBottom: height * 0.025,
  },

  // Location
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: width * 0.025,
    marginBottom: height * 0.03,
  },
  mapThumb: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 12,
    backgroundColor: '#E9EDE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    marginHorizontal: width * 0.03,
  },
  locationTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
    marginBottom: height * 0.004,
  },
  locationAddress: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm,
    color: '#4A4A4A',
  },
  directionButton: {
    backgroundColor: ACTIVE,
    borderRadius: 30,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.035,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm2,
    color: colors.white,
  },

  // Delivery address row
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  pinRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  pinCircle: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    backgroundColor: ACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.025,
  },
  inlineAddress: {
    flex: 1,
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm2,
    color: colors.black,
  },

  // Restaurant row
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  restaurantName: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    backgroundColor: ACTIVE,
    borderRadius: 30,
    paddingVertical: height * 0.014,
    paddingHorizontal: width * 0.04,
  },
  phoneText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm2,
    color: colors.white,
  },

  // Summary
  summary: {
    marginTop: height * 0.005,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.022,
  },
  summaryLabel: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  summaryValue: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  summaryStrong: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.xl,
  },
});

export default OrderDetailsSheet;
