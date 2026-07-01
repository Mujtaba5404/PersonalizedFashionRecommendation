import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import CustomProfileImgModal from '../components/CustomProfileImage';
import TopHeader from '../components/Topheader';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToCart } from '../redux/slice/cartSlice';
import { BASE_URL, apiHelper } from '../services';
import { ensureAuthToken } from '../services/auth';
import { uploadFile } from '../services/upload';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

type ARTryOnParams = {
  ARTryOn?: {
    productId?: number | string;
    title?: string;
    price?: string;
    brand?: string;
    dressImage?: ImageSourcePropType;
  };
};

type BodyPhoto = { uri: string; base64: string; mime: string };

// Friendly messages for the backend's logical-failure error_type values.
const FAILURE_MESSAGES: Record<string, string> = {
  no_human_detected:
    'Photo mein koi insaan nahi mila. Apna poora full-body photo lagayein.',
  low_visibility:
    'Body theek se nahi dikh rahi. Achhi roshni mein poora full-body photo lagayein.',
  invalid_file: 'Image file invalid hai. Doosri photo try karein.',
  product_not_found: 'Yeh product nahi mila. Doosra product try karein.',
  dress_image_missing: 'Is product ki dress image available nahi.',
  model_missing: 'Try-on model abhi available nahi hai.',
  ar_unavailable: 'Try-on service abhi available nahi. Baad mein try karein.',
};

const ARTryOn = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<ARTryOnParams, 'ARTryOn'>>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.role.userAuthToken);

  const productId = route.params?.productId;
  const title = route.params?.title ?? 'Try-On';
  const price = route.params?.price ?? '';
  const dressImage = route.params?.dressImage ?? images.product1;

  const [modalOpen, setModalOpen] = useState(false);
  const [bodyPhoto, setBodyPhoto] = useState<BodyPhoto | null>(null);
  const [resultUri, setResultUri] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [adding, setAdding] = useState(false);

  const toggleModal = () => setModalOpen(o => !o);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Try-on ke liye full-body photo lena hai.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const onPicked = (image: { path: string; data?: string | null; mime?: string }) => {
    if (!image?.data) return;
    setResultUri(null); // new photo -> clear old result
    setBodyPhoto({
      uri: image.path,
      base64: image.data,
      mime: image.mime || 'image/jpeg',
    });
  };

  const openGallery = () => {
    setModalOpen(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 720,
        height: 1280,
        cropping: false,
        mediaType: 'photo',
        includeBase64: true,
      })
        .then(onPicked)
        .catch(() => {});
    }, 400);
  };

  const openCamera = () => {
    setModalOpen(false);
    setTimeout(async () => {
      const ok = await requestCameraPermission();
      if (!ok) return;
      ImagePicker.openCamera({
        width: 720,
        height: 1280,
        cropping: false,
        mediaType: 'photo',
        includeBase64: true,
      })
        .then(onPicked)
        .catch(() => {});
    }, 400);
  };

  const handleTryOn = async () => {
    if (processing) return;
    if (productId == null) {
      Toast.show({ type: 'error', text1: 'Product missing', text2: 'Product id nahi mila.' });
      return;
    }
    if (!bodyPhoto?.base64) {
      Toast.show({
        type: 'error',
        text1: 'Photo required',
        text2: 'Pehle apna full-body photo lagayein.',
      });
      return;
    }

    setProcessing(true);
    await ensureAuthToken();

    // POST /tryon/capture?product_id=<id>  (multipart field "image_file")
    const { data, error } = await uploadFile(
      'tryon/capture',
      {
        name: 'image_file',
        base64: bodyPhoto.base64,
        mime: bodyPhoto.mime,
        filename: 'body.jpg',
      },
      { product_id: productId },
    );
    setProcessing(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Try-on failed',
        text2: typeof error === 'string' ? error : 'Please try again.',
      });
      return;
    }

    // HTTP 200 even on logical failure — branch on the "status" field.
    if (data?.status === 'success') {
      const tid = data?.data?.id;
      const path =
        data?.data?.tryon_image_url || (tid != null ? `/tryon/result/${tid}` : null);
      if (!path) {
        Toast.show({ type: 'error', text1: 'Try-on failed', text2: 'Result image nahi mila.' });
        return;
      }
      setResultUri(`${BASE_URL}${path}`);
      Toast.show({ type: 'success', text1: 'Try-on ready' });
    } else {
      const type = data?.error_type || '';
      Toast.show({
        type: 'error',
        text1: 'Try-on failed',
        text2: FAILURE_MESSAGES[type] || data?.message || 'Could not render the try-on.',
      });
    }
  };

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    if (productId != null) {
      await apiHelper('POST', 'cart/add', {}, {}, {
        product_id: Number(productId),
        size: 'M',
        quantity: 1,
      }).catch(() => undefined);
    }
    dispatch(
      addToCart({
        productId: productId ?? title,
        name: title,
        description: '',
        image: dressImage,
        size: 'M',
        price: price || 'N/A',
        quantity: 1,
      }),
    );
    setAdding(false);
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: 'Your outfit was added to the cart.',
    });
    navigation.navigate('Cart');
  };

  // Auth header so the protected /tryon/result/<id> image can load.
  const resultSource = resultUri
    ? { uri: resultUri, headers: token ? { Authorization: `Bearer ${token}` } : undefined }
    : null;

  return (
    <View style={styles.container}>
      <TopHeader isBack text="Try-On" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Selected product (reference) */}
        <View style={styles.refRow}>
          <Image source={dressImage} style={styles.refImage} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={styles.refLabel}>Selected outfit</Text>
            {!!price && <Text style={styles.refPrice}>{price}</Text>}
          </View>
        </View>

        {/* Result OR body-photo preview */}
        <View style={styles.stage}>
          {processing ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.lightbrown} />
              <Text style={styles.muted}>Rendering try-on...</Text>
            </View>
          ) : resultSource ? (
            <Image source={resultSource} style={styles.stageImage} resizeMode="contain" />
          ) : bodyPhoto ? (
            <Image source={{ uri: bodyPhoto.uri }} style={styles.stageImage} resizeMode="contain" />
          ) : (
            <View style={styles.center}>
              <Text style={styles.muted}>
                Apna full-body photo lagayein, phir "Try On" dabayein.
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.pickBtn} onPress={toggleModal} activeOpacity={0.85}>
          <Text style={styles.pickBtnText}>
            {bodyPhoto ? 'Change full-body photo' : 'Upload full-body photo'}
          </Text>
        </TouchableOpacity>

        <CustomButton
          text={processing ? 'Processing...' : 'Try On'}
          textColor={colors.white}
          btnHeight={height * 0.065}
          btnWidth={width * 0.9}
          backgroundColor={colors.lightbrown}
          borderRadius={20}
          disabled={processing || !bodyPhoto}
          onPress={handleTryOn}
        />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + height * 0.015 }]}>
        {!!price && <Text style={styles.footerPrice}>{price}</Text>}
        <CustomButton
          text={adding ? 'Adding...' : 'Add To Cart'}
          textColor={colors.white}
          btnHeight={height * 0.06}
          btnWidth={width * 0.5}
          backgroundColor={colors.brown}
          borderRadius={20}
          disabled={adding}
          onPress={handleAddToCart}
        />
      </View>

      <CustomProfileImgModal
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        gallery={openGallery}
        camera={openCamera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  scroll: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.14,
  },
  title: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    marginBottom: height * 0.015,
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: width * 0.03,
    marginBottom: height * 0.02,
  },
  refImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 12,
    backgroundColor: '#ECECEC',
  },
  refLabel: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: '#6B6B6B',
  },
  refPrice: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.md,
    color: colors.marhoon,
    marginTop: 2,
  },
  stage: {
    height: height * 0.42,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: height * 0.02,
  },
  stageImage: { width: '100%', height: '100%' },
  center: { alignItems: 'center', paddingHorizontal: width * 0.08, gap: height * 0.012 },
  muted: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: '#8A8A8A',
    textAlign: 'center',
  },
  pickBtn: {
    alignItems: 'center',
    paddingVertical: height * 0.016,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.lightbrown,
    marginBottom: height * 0.015,
  },
  pickBtnText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.lightbrown,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.015,
  },
  footerPrice: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.xl,
    color: colors.black,
  },
});

export default ARTryOn;
