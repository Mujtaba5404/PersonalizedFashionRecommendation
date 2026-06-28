import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useState } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToCart } from '../redux/slice/cartSlice';
import { apiHelper } from '../services';
import { uploadFile } from '../services/upload';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import TopHeader from '../components/Topheader';

type ARTryOnParams = {
  ARTryOn?: {
    productId?: number | string;
    title?: string;
    price?: string;
    brand?: string;
    dressImage?: ImageSourcePropType;
  };
};

const ARTryOn = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<ARTryOnParams, 'ARTryOn'>>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const arPhoto = useAppSelector(state => state.role.arPhoto);

  const productId = route.params?.productId;
  const title = route.params?.title ?? 'Try-On';
  const price = route.params?.price ?? '';
  const dressImage = route.params?.dressImage ?? images.product1;

  const [adding, setAdding] = useState(false);

  // Best-effort: save the try-on snapshot server-side. Non-blocking; failures
  // (e.g. the server can't reach the dress image) are silently ignored.
  const captureTryOn = () => {
    if (productId == null || !arPhoto?.base64) return;
    uploadFile(
      'tryon/capture',
      {
        name: 'image_file',
        base64: arPhoto.base64,
        mime: arPhoto.mime || 'image/jpeg',
        filename: 'tryon.jpg',
      },
      { product_id: productId },
    ).catch(() => { });
  };

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);

    // Best-effort try-on capture + server cart sync.
    captureTryOn();
    if (productId != null) {
      await apiHelper('POST', 'cart/add', {}, {}, {
        product_id: Number(productId),
        size: 'M',
        quantity: 1,
      }).catch(() => undefined);
    }

    // Always reflect the item in the local cart so the UI stays consistent.
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
      text2: 'Your try-on outfit was added to the cart.',
    });
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={arPhoto?.uri ? { uri: arPhoto.uri } : images.Background}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Top bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + height * 0.01 }]}>
          <TopHeader isBack={true} />
          <Text style={styles.topTitle} numberOfLines={1}>
            {title}
          </Text>
          {/* <View style={styles.iconBtn} /> */}
        </View>
      </ImageBackground>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + height * 0.015 }]}>
        {!!price && <Text style={styles.price}>{price}</Text>}
        <CustomButton
          text={adding ? 'Adding...' : 'Add To Cart'}
          textColor={colors.white}
          btnHeight={height * 0.065}
          btnWidth={width * 0.85}
          backgroundColor={colors.lightbrown}
          borderRadius={20}
          disabled={adding}
          onPress={handleAddToCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  bg: {
    flex: 1,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  iconBtn: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: width * 0.05,
    height: width * 0.05,
    resizeMode: 'contain',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: width * 0.02,
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.white,
  },
  dressWrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: height * 0.28,
  },
  dress: {
    width: width * 0.55,
    height: height * 0.4,
    resizeMode: 'contain',
  },
  hint: {
    position: 'absolute',
    bottom: height * 0.02,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: 20,
  },
  hintText: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
  },
  sizeControls: {
    position: 'absolute',
    right: width * 0.06,
    top: height * 0.62,
    gap: height * 0.015,
  },
  sizeBtn: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: colors.lightbrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnText: {
    color: colors.white,
    fontSize: fontSizes.xl ?? 26,
    fontFamily: fontFamily.UrbanistExtraBold,
    lineHeight: fontSizes.xl ?? 28,
  },
  resetBtnText: {
    color: colors.white,
    fontSize: fontSizes.lg ?? 22,
    fontFamily: fontFamily.UrbanistExtraBold,
  },
  footer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: height * 0.015,
  },
  price: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginBottom: height * 0.01,
  },
});

export default ARTryOn;
