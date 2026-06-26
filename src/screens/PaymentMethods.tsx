import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import TopHeader from '../components/Topheader';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addCard, removeCard, selectCard } from '../redux/slice/paymentSlice';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

// Small Mastercard-style logo built from two overlapping circles
const MastercardLogo = () => (
  <View style={styles.mcLogo}>
    <View style={[styles.mcCircle, styles.mcRed]} />
    <View style={[styles.mcCircle, styles.mcYellow]} />
  </View>
);

const SWIPE_THRESHOLD = -width * 0.3;

// Wraps a card row and lets the user swipe it left to delete
const SwipeableCard = ({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      // Only take over for clearly horizontal-left drags, so taps still work
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) {
          translateX.setValue(g.dx);
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: -width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onDelete());
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.deleteBackground}>
        <Image source={images.Remove} style={{ width: width * 0.06, height: width * 0.06, }} />
      </View>
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const PaymentMethods = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  const cards = useAppSelector(state => state.payment.cards);
  const selectedId = useAppSelector(state => state.payment.selectedCardId);

  // Add Card sheet state
  const [sheetVisible, setSheetVisible] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [rememberCard, setRememberCard] = useState(true);

  const resetSheet = () => {
    setNameOnCard('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setRememberCard(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    resetSheet();
  };

  const handleDeleteCard = (id: number) => {
    dispatch(removeCard(id));
  };

  const handleAddCard = () => {
    const digits = cardNumber.replace(/\s/g, '');
    const last4 = digits.slice(-4) || '0000';
    dispatch(
      addCard({
        id: cards.length ? cards[cards.length - 1].id + 1 : 1,
        name: nameOnCard.trim() || 'Debit/Credit Card',
        number: digits,
        expiry: expiry.trim(),
        cvv: cvv.trim(),
        last4,
      }),
    );
    closeSheet();
  };

  return (
    <View style={styles.screen}>
      <TopHeader text="Manage Payment Methods" isBack={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {cards.map(card => {
          const selected = card.id === selectedId;
          return (
            <SwipeableCard
              key={card.id}
              onDelete={() => handleDeleteCard(card.id)}
            >
              <TouchableOpacity
                style={styles.cardRow}
                activeOpacity={0.8}
                onPress={() => dispatch(selectCard(card.id))}
              >
                <MastercardLogo />

                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardNumber}>
                    <Text style={styles.mask}>****  ****  ****  </Text>
                    {card.last4}
                  </Text>
                </View>

                <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </SwipeableCard>
          );
        })}
      </ScrollView>

      {/* Add Payment Method */}
      <View style={styles.bottomBar}>
        <CustomButton
          text="Add Payment Method"
          textColor={colors.white}
          backgroundColor={colors.lightbrown}
          borderRadius={30}
          btnWidth={width * 0.9}
          btnHeight={height * 0.07}
          fontSize={fontSizes.md}
          onPress={() => setSheetVisible(true)}
        />
      </View>

      {/* Add Card Details bottom sheet */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          style={styles.sheetOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.sheetBackdrop} onPress={closeSheet} />

          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderText}>
                <Text style={styles.sheetTitle}>Add Card Details</Text>
                <Text style={styles.sheetSubtitle}>
                  Please enter the card details
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.7}
                onPress={closeSheet}
              >
                <Icon name="close" size={width * 0.055} color={colors.black} />
              </TouchableOpacity>
            </View>

            {/* Remember card */}
            <TouchableOpacity
              style={styles.rememberRow}
              activeOpacity={0.7}
              onPress={() => setRememberCard(prev => !prev)}
            >
              <View style={[styles.checkbox, rememberCard && styles.checkboxActive]}>
                {rememberCard && (
                  <Icon name="checkmark" size={width * 0.04} color={colors.white} />
                )}
              </View>
              <Text style={styles.rememberText}>Remember This Card</Text>
            </TouchableOpacity>

            {/* Name on Card */}
            <TextInput
              style={styles.input}
              placeholder="Name on Card"
              placeholderTextColor="#6B6B6B"
              value={nameOnCard}
              onChangeText={setNameOnCard}
            />

            {/* Card Number */}
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#6B6B6B"
              keyboardType="number-pad"
              maxLength={19}
              value={cardNumber}
              onChangeText={setCardNumber}
            />

            {/* Expiry + CVV */}
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Expiry"
                placeholderTextColor="#6B6B6B"
                value={expiry}
                onChangeText={setExpiry}
                maxLength={5}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CVV"
                placeholderTextColor="#6B6B6B"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                value={cvv}
                onChangeText={setCvv}
              />
            </View>

            <View style={styles.sheetButton}>
              <CustomButton
                text="Add Card"
                textColor={colors.white}
                backgroundColor={colors.lightbrown}
                borderRadius={30}
                btnWidth={width * 0.9}
                btnHeight={height * 0.07}
                fontSize={fontSizes.md}
                onPress={handleAddCard}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.05,
  },

  // Swipe-to-delete
  swipeContainer: {
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: height * 0.018,
    backgroundColor: '#E53935',
    borderRadius: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },

  // Card row
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 16,
    paddingVertical: height * 0.022,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.018,
  },
  cardInfo: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  cardName: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
    marginBottom: height * 0.006,
  },
  cardNumber: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  mask: {
    fontSize: fontSizes.sm2,
    letterSpacing: 1,
  },

  // Mastercard logo
  mcLogo: {
    width: width * 0.12,
    height: width * 0.08,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcCircle: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.03,
  },
  mcRed: {
    backgroundColor: '#EB001B',
  },
  mcYellow: {
    backgroundColor: '#F79E1B',
    marginLeft: -width * 0.025,
    opacity: 0.9,
  },

  // Radio
  radioOuter: {
    width: width * 0.055,
    height: width * 0.055,
    borderRadius: width * 0.0275,
    borderWidth: 1.5,
    borderColor: '#CFCFCF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: colors.brown,
  },
  radioInner: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: width * 0.015,
    backgroundColor: '#1B1B3A',
  },

  // Bottom bar
  bottomBar: {
    alignItems: 'center',
    paddingBottom: height * 0.04,
    paddingTop: height * 0.01,
  },

  // Bottom sheet
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.gray,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.04,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sheetHeaderText: {
    flex: 1,
  },
  sheetTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginBottom: height * 0.004,
  },
  sheetSubtitle: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm2,
    color: '#6B6B6B',
  },
  closeButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: height * 0.02,
  },
  checkbox: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CFCFCF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.02,
  },
  checkboxActive: {
    backgroundColor: colors.lightbrown,
    borderColor: colors.lightbrown,
  },
  rememberText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
    marginBottom: height * 0.015,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: width * 0.03,
  },
  halfInput: {
    flex: 1,
  },
  sheetButton: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
});

export default PaymentMethods;
