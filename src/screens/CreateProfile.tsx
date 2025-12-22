import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import CustomSelect from '../components/CustomSelect';
import TopHeader from '../components/Topheader';
import { MainStackParamList } from '../navigation/MainStack';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import CustomTextInput from '../components/CustomTextInput';
import CustomProfileImgModal from '../components/CustomProfileImage';
import ImagePicker from 'react-native-image-crop-picker';

// type Props = NativeStackScreenProps<MainStackParamList, 'CreateProfile'>;

const CreateProfile = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [Waist, setWaist] = useState('');
  const [shoulder, setShoulder] = useState('');
  const [chest, setChest] = useState('');
  const [hiips, setHips] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const countryOption = [
    { name: 'Country', id: '' },
    { name: 'United State', id: 'united state' },
    { name: 'United Kingdom', id: 'united kingdom' },
    { name: 'Other', id: 'other' },
  ];
  const chestWidth = [
    { name: 'Chest', id: '' },
    { name: 'XS → 30–32 in', id: 'XS → 30–32 in' },
    { name: 'S → 33–35 in', id: 'S → 33–35 in' },
    { name: 'M → 36–38 in', id: 'M → 36–38 in' },
    { name: 'L → 39–41 in', id: 'L → 39–41 in' },
  ];
  const shoulderWidth  = [
    { name: 'Shoulder ', id: '' },
    { name: '20', id: '20' },
    { name: '22', id: '22' },
    { name: '24', id: '24' },
  ];
  const waist = [
    { name: 'Waist', id: '' },
    { name: 'XS → 24–25 inch', id: 'XS → 24–25 inch' },
    { name: 'S → 26–27 inch', id: 'S → 26–27 inch' },
    { name: 'M → 28–30 inch', id: 'M → 28–30 inch' },
    { name: 'L → 31–33 inch', id: 'L → 31–33 inch' },
  ];
    const hips = [
    { name: 'Hips', id: '' },
    { name: 'XS → 32–34 in', id: 'XS → 32–34 in' },
    { name: 'S → 35–37 in', id: 'S → 35–37 in' },
    { name: 'M → 38–40 in', id: 'M → 38–40 in' },
    { name: 'L → 41–43 in', id: 'L → 41–43 in' },
  ];
  const relationshipOptions = [
    { name: 'Relationship Status', id: '' },
    { name: 'Single', id: 'single' },
    { name: 'Married', id: 'married' },
  ];

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleCreateProfile = () => {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
    setIsModalVisible(true);
  }, 500);
};

  return (
    <ImageBackground
    source={images.Background}
    style={styles.imgbg}
    >
      <TopHeader text="Profile Setup" isBack={true} />
      <View style={styles.container}>
        <View style={styles.imgMain}>
          <TouchableOpacity onPress={toggleModal} activeOpacity={0.7}>
            <Image 
              source={images.profile}
              style={styles.profileImg} 
            />
          </TouchableOpacity>
          <Text style={styles.profText}>Harden Scoot</Text>
        </View>

        <View style={styles.inputMain}>
          <View style={styles.row}>
            <CustomTextInput
              placeholder="Age"
              placeholderTextColor={colors.black}
              inputHeight={height * 0.06}
              inputWidth={width * 0.41}
              borderRadius={20}
              value={country}
              onChangeText={setCountry}
              keyboardType="default"
              fontFamily={fontFamily.UrbanistMedium}
              fontSize={fontSizes.sm2}
            />
            <CustomTextInput
              placeholder="Height"
              placeholderTextColor={colors.black}
              inputHeight={height * 0.06}
              inputWidth={width * 0.41}
              borderRadius={20}
              value={city}
              onChangeText={setCity}
              keyboardType="default"
              fontFamily={fontFamily.UrbanistMedium}
              fontSize={fontSizes.sm2}
            />
          </View>

          <CustomSelect
            inputWidth={width * 0.85}
            inputHeight={height * 0.06}
            selectElements={relationshipOptions}
            borderColor={colors.lightGray}
            inputColor={colors.white}
            borderRadius={20}
            onChangeText={setRelationshipStatus}
            setSelectedElement={setRelationshipStatus}
            defaultValue=""
            rightIcon={images.arrowdown}
          />

        <View style={styles.row}>
            <CustomSelect
              inputWidth={width * 0.85}
              inputHeight={height * 0.06}
              selectElements={waist}
              borderColor={colors.lightGray}
              inputColor={colors.white}
              borderRadius={20}
              onChangeText={setWaist}
              setSelectedElement={setWaist}
              defaultValue=""
              rightIcon={images.arrowdown}
            />
        </View>

         <View style={styles.row}>
            <CustomSelect
              inputWidth={width * 0.85}
              inputHeight={height * 0.06}
              selectElements={shoulderWidth}
              borderColor={colors.lightGray}
              inputColor={colors.white}
              borderRadius={20}
              onChangeText={setShoulder}
              setSelectedElement={setShoulder}
              defaultValue=""
              rightIcon={images.arrowdown}
            />
        </View>

        <View style={styles.row}>
            <CustomSelect
              inputWidth={width * 0.85}
              inputHeight={height * 0.06}
              selectElements={chestWidth}
              borderColor={colors.lightGray}
              inputColor={colors.white}
              borderRadius={20}
              onChangeText={setChest}
              setSelectedElement={setChest}
              defaultValue=""
              rightIcon={images.arrowdown}
            />
        </View>

        <View style={styles.row}>
            <CustomSelect
              inputWidth={width * 0.85}
              inputHeight={height * 0.06}
              selectElements={hips}
              borderColor={colors.lightGray}
              inputColor={colors.white}
              borderRadius={20}
              onChangeText={setHips}
              setSelectedElement={setHips}
              defaultValue=""
              rightIcon={images.arrowdown}
            />
        </View>
        </View>

        <View style={styles.btnMain}>
          <CustomButton
            text="Continue"
            textColor={colors.white}
            btnHeight={height * 0.065}
            btnWidth={width * 0.85}
            backgroundColor={colors.lightbrown}
            borderRadius={20}
            onPress={handleCreateProfile}
          />
        </View>
      </View>

      {/* ✅ Success Modal - placed outside container */}
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.iconCircle}>
              <Image source={images.success} />
            </View>
            <Text style={styles.modalTitle}>Register Success</Text>
            <View style={{ gap: height * 0.005 }}>
              <Text style={styles.modalMessage}>
                Congratulation! Your Account Is Created.
              </Text>
              <Text style={styles.modalMessage}>
                Now You Can Easily Use This Application
              </Text>
            </View>
            <View style={{ top: height * 0.02 }}>
              <CustomButton
                text="Let's Get Started!"
                textColor={colors.white}
                backgroundColor={colors.lightbrown}
                btnHeight={height * 0.06}
                btnWidth={width * 0.65}
                borderRadius={30}
                onPress={() => {
                    setIsModalVisible(false); // modal close
                    navigation.navigate('Home'); // navigate to Home
                }}
              />
            </View>
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.lightBlue,
    top: height * 0.015,
    flex: 1,
    gap: height * 0.01,
  },
  imgMain: {
    top: height * 0.03,
    alignItems: 'center',
  },
  profileImg: {
    width: width * 0.35,
    height: height * 0.16,
    resizeMode: 'cover',
    borderRadius: 1000
  },
  profText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
    top: height * 0.01,
  },
  inputMain: {
    alignItems: 'center',
    top: height * 0.07,
    gap: height * 0.01,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.85,
  },
  btnMain: {
    top: height * 0.2,
  },
  newHomeBaseWrapper: {
    width: width * 0.85,
    alignSelf: 'center',
    marginVertical: height * 0.01,
    position: 'relative',
  },
  newHomeBaseCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
  },
  newHomeBaseLabel: {
    color: colors.marhoon,
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm,
    marginBottom: height * 0.015,
  },
  newHomeBaseInput: {
    color: colors.black,
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    paddingVertical: 4,
  },

  /** ✅ Fullscreen Modal Styles **/
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContainer: {
    width: width * 0.8,
    height: height * 0.38,
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF9E8',
    justifyContent: 'center',
    alignItems: 'center',
    top: height * 0.02,
    marginBottom: height * 0.08,
  },
  modalTitle: {
    fontFamily: fontFamily.GilroyBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    bottom: height * 0.02,
  },
  modalMessage: {
    textAlign: 'center',
    color: colors.Gray,
    fontFamily: fontFamily.GilroyRegular,
    fontSize: fontSizes.sm,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
imgbg:{
    alignSelf: 'center',
    width: width * 0.99,
    height: height * 0.9999,
  }
});

export default CreateProfile;
