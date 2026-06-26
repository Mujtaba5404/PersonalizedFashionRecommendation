import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { CountryPicker } from 'react-native-country-codes-picker';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import CustomButton from '../components/CustomButton';
import CustomSelect from '../components/CustomSelect';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

export interface DeliveryAddress {
  id?: string | number;
  fullName: string;
  countryCode: string;
  flag: string;
  phone: string;
  province: string;
  city: string;
  areaCode: string;
  completeAddress: string;
  label: 'Home' | 'Office';
  isDefault: boolean;
}

type AddDeliveryAddressRoute = {
  AddDeliveryAddress: { address?: DeliveryAddress } | undefined;
};

const provinces = [
  { name: 'Sindh' },
  { name: 'Punjab' },
  { name: 'Balochistan' },
  { name: 'Khyber Pakhtunkhwa' },
  { name: 'Gilgit-Baltistan' },
];

const cities = [
  { name: 'Karachi' },
  { name: 'Lahore' },
  { name: 'Islamabad' },
  { name: 'Quetta' },
  { name: 'Peshawar' },
];

const AddDeliveryAddress = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<AddDeliveryAddressRoute, 'AddDeliveryAddress'>>();
  const insets = useSafeAreaInsets();
  const existing = route.params?.address;

  const [fullName, setFullName] = useState(existing?.fullName ?? '');
  const [countryCode, setCountryCode] = useState(existing?.countryCode ?? '+92');
  const [flag, setFlag] = useState(existing?.flag ?? '🇵🇰');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [province, setProvince] = useState(existing?.province ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [areaCode, setAreaCode] = useState(existing?.areaCode ?? '');
  const [completeAddress, setCompleteAddress] = useState(
    existing?.completeAddress ?? '',
  );
  const [label, setLabel] = useState<'Home' | 'Office'>(existing?.label ?? 'Home');
  const [isDefault, setIsDefault] = useState(existing?.isDefault ?? true);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const isFormValid =
    fullName.trim().length > 0 &&
    phone.trim().length > 0 &&
    province.length > 0 &&
    city.length > 0 &&
    completeAddress.trim().length > 0;

  const handleCountrySelect = (item: { dial_code: string; flag: string }) => {
    setCountryCode(item.dial_code);
    setFlag(item.flag);
    setShowCountryPicker(false);
  };

  const handleSave = async () => {
    if (saving) return;

    const address: DeliveryAddress = {
      fullName: fullName.trim(),
      countryCode,
      flag,
      phone: phone.trim(),
      province,
      city,
      areaCode: areaCode.trim(),
      completeAddress: completeAddress.trim(),
      label,
      isDefault,
    };

    setSaving(true);
    const { error } = await apiHelper('POST', 'payment/address', {}, {}, {
      full_name: address.fullName,
      phone_number: `${countryCode}${address.phone}`,
      province: address.province,
      city: address.city,
      area_code: address.areaCode,
      complete_address: address.completeAddress,
      label: address.label,
    });
    setSaving(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to save address',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Address saved',
      text2: 'Your delivery address has been saved.',
    });
    navigation.navigate('Checkout', { address });
  };

  return (
    <View style={styles.container}>
      <TopHeader isBack text="Add Delivery Address" />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add Delivery Address</Text>
        <Text style={styles.subtitle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </Text>

        {/* FULL NAME */}
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={'#9E9E9E'}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* PHONE */}
        <View style={styles.inputBox}>
          <TouchableOpacity
            style={styles.flagButton}
            activeOpacity={0.7}
            onPress={() => setShowCountryPicker(true)}
          >
            <Text style={styles.flagText}>{flag}</Text>
            <Text style={styles.codeText}>{countryCode}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Phone Number"
            placeholderTextColor={'#9E9E9E'}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* PROVINCE / REGION */}
        <CustomSelect
          inputWidth={width * 0.9}
          inputHeight={height * 0.07}
          selectElements={provinces}
          borderColor={'#F2F2F2'}
          inputColor={'#F2F2F2'}
          borderRadius={25}
          placeholder="Province/Region"
          preselectedValue={province}
          onChangeText={value => setProvince(value)}
        />

        <View style={{ height: height * 0.018 }} />

        {/* CITY */}
        <CustomSelect
          inputWidth={width * 0.9}
          inputHeight={height * 0.07}
          selectElements={cities}
          borderColor={'#F2F2F2'}
          inputColor={'#F2F2F2'}
          borderRadius={25}
          placeholder="City"
          preselectedValue={city}
          onChangeText={value => setCity(value)}
        />

        {/* AREA CODE */}
        <View style={[styles.inputBox, { marginTop: height * 0.018 }]}>
          <TextInput
            style={styles.input}
            placeholder="Area Code"
            placeholderTextColor={'#9E9E9E'}
            keyboardType="number-pad"
            value={areaCode}
            onChangeText={setAreaCode}
          />
        </View>

        {/* COMPLETE ADDRESS */}
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Complete Address"
            placeholderTextColor={'#9E9E9E'}
            value={completeAddress}
            onChangeText={setCompleteAddress}
          />
        </View>

        {/* LABEL */}
        <Text style={styles.labelTitle}>Select a label for effective delivery</Text>
        <View style={styles.labelRow}>
          {(['Home', 'Office'] as const).map(item => {
            const active = label === item;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                onPress={() => setLabel(item)}
                style={[styles.labelChip, active && styles.labelChipActive]}
              >
                <Text style={[styles.labelChipText, active && styles.labelChipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DEFAULT CHECKBOX */}
        <View style={styles.defaultRow}>
          <BouncyCheckbox
            size={24}
            fillColor={colors.lightbrown}
            unFillColor={colors.white}
            isChecked={isDefault}
            useBuiltInState={false}
            disableText
            iconStyle={{ borderColor: colors.lightbrown, borderWidth: 2, borderRadius: 8 }}
            innerIconStyle={{ borderRadius: 8 }}
            onPress={() => setIsDefault(prev => !prev)}
          />
          <Text style={styles.defaultText}>Make default delivery Address</Text>
        </View>
      </KeyboardAwareScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + height * 0.02 }]}>
        <CustomButton
          text={saving ? 'Saving...' : 'Save'}
          textColor={colors.white}
          backgroundColor={colors.lightbrown}
          borderRadius={25}
          btnWidth={width * 0.9}
          btnHeight={height * 0.075}
          fontSize={fontSizes.md}
          disabled={!isFormValid || saving}
          onPress={handleSave}
        />
      </View>

      <Modal
        visible={showCountryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <CountryPicker
          show={showCountryPicker}
          pickerButtonOnPress={handleCountrySelect}
          style={{
            modal: { height: height * 0.7 },
            textInput: { color: colors.black },
          }}
          lang=""
        />
      </Modal>
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
  title: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    marginTop: height * 0.01,
    marginBottom: height * 0.008,
  },
  subtitle: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm2,
    color: '#7A7A7A',
    marginBottom: height * 0.025,
  },

  // Inputs
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
    height: height * 0.07,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.018,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
    paddingVertical: 0,
  },
  flagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  flagText: {
    fontSize: fontSizes.lg2,
  },
  codeText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  divider: {
    width: 1,
    height: '45%',
    backgroundColor: '#C9C9C9',
    marginHorizontal: width * 0.04,
  },
  phoneInput: {
    paddingLeft: 0,
  },

  // Label chips
  labelTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.md,
    color: colors.black,
    marginTop: height * 0.01,
    marginBottom: height * 0.015,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  labelChip: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.012,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.lightbrown,
  },
  labelChipActive: {
    backgroundColor: colors.lightbrown,
  },
  labelChipText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.lightbrown,
  },
  labelChipTextActive: {
    color: colors.white,
  },

  // Default checkbox
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  defaultText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
    paddingHorizontal: width * 0.02,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.015,
    alignItems: 'center',
  },
});

export default AddDeliveryAddress;
