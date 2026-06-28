import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../redux/hooks';
import { setArPhoto, setUserAuthToken } from '../redux/slice/roleSlice';
import { uploadFile } from '../services/upload';
import { ensureAuthToken } from '../services/auth';

// type Props = NativeStackScreenProps<MainStackParamList, 'CreateProfile'>;

const CreateProfile = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  // Base64 + mime of the chosen photo, needed for the skin-tone upload.
  const [photoData, setPhotoData] = useState<{ base64: string; mime: string } | null>(null);
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
  const [postalCode, setPostalCode] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // Categories match the backend `main_category` values used by
  // GET /skintone/recommendations?category=
  const categoryOptions = [
    { name: 'Select category', id: '' },
    { name: 'Summer Wear', id: 'Summer Wear' },
    { name: 'Winter Wear', id: 'Winter Wear' },
    { name: 'Party Wear', id: 'Party Wear' },
    { name: 'Shadi Wear', id: 'Shadi Wear' },
  ];

  // Sub-categories keyed by the parent category id.
  const subCategoryMap: Record<string, { name: string; id: string }[]> = {
    casual: [
      { name: 'Ready to wear', id: 'ready-to-wear' },
      { name: 'Unstitched', id: 'unstitched' },
    ],
    seasonal: [
      { name: 'Summer', id: 'summer' },
      { name: 'Winters', id: 'winters' },
    ],
    'shadi-wear': [
      { name: 'Barat', id: 'barat' },
      { name: 'Valima', id: 'valima' },
      { name: 'Mehndi', id: 'mehndi' },
    ],
  };

  // Options for the second dropdown, derived from the selected category.
  const subCategoryOptions = category ? subCategoryMap[category] ?? [] : [];

  const handleCategoryChange = (_name: string, id?: string | null) => {
    setCategory(id ?? '');
    // Reset the sub-category whenever the main category changes.
    setSubCategory('');
  };

  const handleSubCategoryChange = (_name: string, id?: string | null) => {
    setSubCategory(id ?? '');
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take a profile photo.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  // Stores the picked image for both preview (uri) and upload (base64).
  const handlePicked = (image: { path: string; data?: string | null; mime?: string }) => {
    setProfileImage(image.path);
    if (image.data) {
      const mime = image.mime || 'image/jpeg';
      setPhotoData({ base64: image.data, mime });
      dispatch(setArPhoto({ uri: image.path, base64: image.data, mime }));
    }
  };

  const openGallery = () => {
    // Close the modal first so the native picker isn't blocked by the JS Modal.
    setModalOpen(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
      })
        .then(handlePicked)
        .catch(() => { });
    }, 400);
  };

  const openCamera = () => {
    // Close the modal first so the native camera isn't blocked by the JS Modal.
    setModalOpen(false);
    setTimeout(async () => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return;
      }
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
      })
        .then(handlePicked)
        .catch(() => { });
    }, 400);
  };

  const handleCreateProfile = async () => {
    if (loading) return;

    if (!photoData?.base64) {
      Toast.show({
        type: 'error',
        text1: 'Photo required',
        text2: 'Please upload a clear photo of your face first.',
      });
      return;
    }
    if (!category) {
      Toast.show({
        type: 'error',
        text1: 'Select a category',
        text2: 'Please choose a clothing category to continue.',
      });
      return;
    }

    const categoryName =
      categoryOptions.find(c => c.id === category)?.name ?? category;

    setLoading(true);

    // The analyze + recommendations endpoints are auth-protected. Obtain a
    // token silently using the credentials captured at registration.
    const token = await ensureAuthToken();
    if (!token) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Session expired',
        text2: 'Please sign in again to continue.',
      });
      navigation.navigate('SignInEmail');
      return;
    }

    // Upload the photo for skin-tone analysis (multipart field `file`).
    // Pass the token explicitly so the request can't race the store update.
    const uploadArgs = {
      name: 'file',
      base64: photoData.base64,
      mime: photoData.mime,
      filename: 'profile.jpg',
    } as const;

    let result = await uploadFile('skintone/analyze', uploadArgs, {}, token);

    // A persisted token can be expired / from an old backend session. On 401,
    // drop it, log in fresh, and retry once.
    if (result.status === 401) {
      dispatch(setUserAuthToken(null));
      const freshToken = await ensureAuthToken(true);
      if (freshToken) {
        result = await uploadFile('skintone/analyze', uploadArgs, {}, freshToken);
      }
    }

    const { data, error } = result;
    setLoading(false);

    if (result.status === 401) {
      Toast.show({
        type: 'error',
        text1: 'Session expired',
        text2: 'Please sign in again to continue.',
      });
      navigation.navigate('SignInEmail');
      return;
    }

    if (error || !data) {
      Toast.show({
        type: 'error',
        text1: 'Analysis failed',
        text2:
          typeof error === 'string' ? error : 'Could not analyze the photo. Please try again.',
      });
      return;
    }

    const detectedTone = data.detected_tone ?? data.tone ?? '';
    const detectedHex = data.hex ?? data.detected_hex ?? '';

    Toast.show({
      type: 'success',
      text1: 'Skin tone detected',
      text2: data.message || `Detected tone: ${detectedTone || 'done'}`,
    });

    navigation.navigate('RecommendedProducts', {
      category,
      categoryName,
      detectedTone,
      detectedHex,
    });
  };

  return (
    <ImageBackground
      source={images.Background}
      style={styles.imgbg}
    >
      <TopHeader text="User Profile" isBack={true} />
      <View style={styles.container}>
        <View style={styles.imgMain}>
          <TouchableOpacity onPress={toggleModal} activeOpacity={0.7}>
            <Image
              source={profileImage ? { uri: profileImage } : images.camera}
              style={styles.profileImg}
            />
            {/* <View style={styles.uploadBadge}>
              <Text style={styles.uploadBadgeText}>Upload</Text>
            </View> */}
          </TouchableOpacity>
          <Text style={styles.profText}>Harden Scoot</Text>
        </View>

        <View style={styles.inputMain}>

          {/* Main category */}
          <CustomSelect
            inputWidth={width * 0.85}
            inputHeight={height * 0.06}
            selectElements={categoryOptions}
            borderColor={colors.white}
            borderWidth={0}
            inputColor={colors.white}
            borderRadius={20}
            placeholder="Select category"
            onChangeText={handleCategoryChange}
          />

          {/* Sub-category — dynamically reflects the chosen category */}
          {subCategoryOptions.length > 0 && (
            <CustomSelect
              key={category}
              inputWidth={width * 0.85}
              inputHeight={height * 0.06}
              selectElements={subCategoryOptions}
              borderColor={colors.white}
              borderWidth={0}
              inputColor={colors.white}
              borderRadius={20}
              placeholder="Select sub-category"
              preselectedValue={subCategory}
              onChangeText={handleSubCategoryChange}
            />
          )}
        </View>

        <View style={styles.btnMain}>
          <CustomButton
            text={loading ? 'Analyzing...' : 'Continue'}
            textColor={colors.white}
            btnHeight={height * 0.065}
            btnWidth={width * 0.85}
            backgroundColor={colors.lightbrown}
            borderRadius={20}
            disabled={loading}
            onPress={handleCreateProfile}
          />
        </View>
      </View>

      <CustomProfileImgModal
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        gallery={openGallery}
        camera={openCamera}
      />

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
  uploadBadge: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: colors.lightbrown,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.005,
    borderRadius: 20,
  },
  uploadBadgeText: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
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
    top: height * 0.45,
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
  imgbg: {
    alignSelf: 'center',
    width: width * 0.99,
    height: height * 0.9999,
  }
});

export default CreateProfile;
