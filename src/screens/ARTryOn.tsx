import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  PanResponder,
  PermissionsAndroid,
  Platform,
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
import GarmentCutout from '../components/GarmentCutout';
import TopHeader from '../components/Topheader';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/slice/cartSlice';
import { apiHelper } from '../services';
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

// The stage (body-photo canvas) size the garment is fitted within.
const STAGE_W = width * 0.9;
const STAGE_H = height * 0.6;

// Resolve the garment's natural aspect ratio (height / width) for both
// require() assets and remote {uri} sources, so it keeps its proportions.
const useGarmentAspect = (source: ImageSourcePropType) => {
  const [aspect, setAspect] = useState(1.4);
  useEffect(() => {
    let alive = true;
    try {
      if (typeof source === 'number') {
        const meta = Image.resolveAssetSource(source);
        if (meta?.width && meta?.height) setAspect(meta.height / meta.width);
      } else if (source && typeof source === 'object' && 'uri' in source && source.uri) {
        Image.getSize(
          source.uri,
          (w, h) => alive && w > 0 && setAspect(h / w),
          () => {},
        );
      }
    } catch {}
    return () => {
      alive = false;
    };
  }, [source]);
  return aspect;
};

const ARTryOn = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<ARTryOnParams, 'ARTryOn'>>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const productId = route.params?.productId;
  const title = route.params?.title ?? 'Try-On';
  const price = route.params?.price ?? '';
  const dressImage = route.params?.dressImage ?? images.product1;

  // Background-removed (transparent) version of the product image, so it looks
  // worn on the body instead of a white box. Falls back to the original.
  const [cutoutUri, setCutoutUri] = useState<string | null>(null);
  const garmentSource: ImageSourcePropType = cutoutUri ? { uri: cutoutUri } : dressImage;

  const aspect = useGarmentAspect(garmentSource);

  const [modalOpen, setModalOpen] = useState(false);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [adding, setAdding] = useState(false);

  // Default garment size: ~78% of the stage height (fits the full body), width
  // derived from its aspect ratio. Scale (1 = default) is user-adjustable.
  const baseHeight = STAGE_H * 0.78;
  const baseWidth = baseHeight / aspect;
  const garmentH = baseHeight * scale;
  const garmentW = baseWidth * scale;

  // Draggable position of the garment over the body photo.
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => pan.extractOffset(),
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => pan.flattenOffset(),
    }),
  ).current;

  const grow = () => setScale(s => Math.min(2.5, s + 0.1));
  const shrink = () => setScale(s => Math.max(0.4, s - 0.1));
  const reset = () => {
    pan.setOffset({ x: 0, y: 0 });
    pan.setValue({ x: 0, y: 0 });
    setScale(1);
  };

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

  const onPicked = (image: { path: string }) => {
    if (!image?.path) return;
    setBodyPhoto(image.path);
    reset();
  };

  const openGallery = () => {
    setModalOpen(false);
    setTimeout(() => {
      ImagePicker.openPicker({ mediaType: 'photo', cropping: false })
        .then(onPicked)
        .catch(() => {});
    }, 400);
  };

  const openCamera = () => {
    setModalOpen(false);
    setTimeout(async () => {
      const ok = await requestCameraPermission();
      if (!ok) return;
      ImagePicker.openCamera({ mediaType: 'photo', cropping: false })
        .then(onPicked)
        .catch(() => {});
    }, 400);
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

  return (
    <View style={styles.container}>
      <TopHeader isBack text="Try-On" />

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Stage: body photo + draggable/resizable garment */}
      <View style={styles.stageWrap}>
        <View style={styles.stage}>
          {bodyPhoto ? (
            <>
              <Image source={{ uri: bodyPhoto }} style={styles.bodyImage} resizeMode="cover" />

              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.garmentWrap,
                  {
                    width: garmentW,
                    height: garmentH,
                    left: (STAGE_W - garmentW) / 2,
                    top: STAGE_H * 0.08,
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                  },
                ]}
              >
                <Image source={garmentSource} style={styles.garment} resizeMode="contain" />
              </Animated.View>

              <View style={styles.hint}>
                <Text style={styles.hintText}>Drag karein · + / − se resize · ⟳ reset</Text>
              </View>

              {/* Resize controls */}
              <View style={styles.controls}>
                <TouchableOpacity style={styles.ctrlBtn} onPress={shrink} activeOpacity={0.8}>
                  <Text style={styles.ctrlText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctrlBtn} onPress={grow} activeOpacity={0.8}>
                  <Text style={styles.ctrlText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctrlBtn} onPress={reset} activeOpacity={0.8}>
                  <Text style={styles.ctrlResetText}>⟳</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.center}>
              <Text style={styles.muted}>
                Apna full-body photo lagayein — dress body pe fit karke dikhegi.
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.pickBtn} onPress={toggleModal} activeOpacity={0.85}>
        <Text style={styles.pickBtnText}>
          {bodyPhoto ? 'Change full-body photo' : 'Upload full-body photo'}
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + height * 0.015 }]}>
        {!!price && <Text style={styles.footerPrice}>{price}</Text>}
        <CustomButton
          text={adding ? 'Adding...' : 'Add To Cart'}
          textColor={colors.white}
          btnHeight={height * 0.06}
          btnWidth={width * 0.5}
          backgroundColor={colors.lightbrown}
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

      {/* Hidden: removes the product image's white background -> transparent PNG */}
      {!cutoutUri && (
        <GarmentCutout
          source={dressImage}
          onResult={setCutoutUri}
          onError={msg => console.log('[GarmentCutout] skipped:', msg)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  title: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.01,
  },
  stageWrap: { alignItems: 'center' },
  stage: {
    width: STAGE_W,
    height: STAGE_H,
    borderRadius: 18,
    backgroundColor: colors.white,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  garmentWrap: { position: 'absolute' },
  garment: { width: '100%', height: '100%' },
  center: { paddingHorizontal: width * 0.08 },
  muted: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: '#8A8A8A',
    textAlign: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: height * 0.012,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: width * 0.035,
    paddingVertical: 5,
    borderRadius: 20,
  },
  hintText: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
  },
  controls: {
    position: 'absolute',
    right: width * 0.03,
    top: height * 0.02,
    gap: height * 0.012,
  },
  ctrlBtn: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    backgroundColor: colors.lightbrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlText: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.xl ?? 24,
  },
  ctrlResetText: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg ?? 20,
  },
  pickBtn: {
    alignSelf: 'center',
    marginTop: height * 0.02,
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.lightbrown,
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
