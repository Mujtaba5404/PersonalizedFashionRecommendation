import {
  RouteProp,
  useNavigation,
  useRoute,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/slice/cartSlice';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import TopHeader from '../components/Topheader';

type ProductDetailsParams = {
  ProductDetails?: {
    image?: ImageSourcePropType;
    category?: string;
    title?: string;
    price?: string;
    description?: string;
    productId?: string | number;
  };
};

const DESCRIPTION =
  "dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const ProductDetails = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<ProductDetailsParams, 'ProductDetails'>>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);

  const productId = route.params?.productId;

  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizesLoading, setSizesLoading] = useState(false);
  const [apiPrice, setApiPrice] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const fetchSizes = useCallback(async () => {
    if (productId == null) return;

    setSizesLoading(true);
    const { response, error } = await apiHelper(
      'GET',
      `products/${encodeURIComponent(String(productId))}/sizes`,
    );
    setSizesLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load sizes',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    const data = response?.data;
    const list: string[] = Array.isArray(data?.available_sizes)
      ? data.available_sizes
      : [];

    setSizes(list);
    setSelectedSize(prev => prev ?? list[0] ?? null);
    if (data?.base_price) setApiPrice(`Rs. ${data.base_price}`);
  }, [productId]);

  useFocusEffect(
    useCallback(() => {
      fetchSizes();
    }, [fetchSizes]),
  );

  const product = {
    image: route.params?.image ?? images.khadi,
    category: route.params?.category ?? 'Interpersonal Therapy',
    title:
      route.params?.title ??
      'Lorem Ipsum Dolor Sit Amet Consectetur. Dictum Sapien In Phasellus Rhoncus Commodo.',
    price: apiPrice ?? route.params?.price ?? '$4,500 USD',
    description: route.params?.description ?? DESCRIPTION,
  };

  const handleAddToCart = useCallback(async () => {
    if (adding) return;

    if (productId == null) {
      Toast.show({
        type: 'error',
        text1: 'Unable to add',
        text2: 'Product information is missing.',
      });
      return;
    }

    if (!selectedSize) {
      Toast.show({
        type: 'error',
        text1: 'Select a size',
        text2: 'Please choose a size before adding to cart.',
      });
      return;
    }

    setAdding(true);
    const { error } = await apiHelper('POST', 'cart/add', {}, {}, {
      product_id: Number(productId),
      size: selectedSize,
      quantity: 1,
    });
    setAdding(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to add to cart',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    dispatch(
      addToCart({
        productId,
        name: product.title,
        description: product.description,
        image: product.image,
        size: selectedSize,
        price: product.price,
        quantity: 1,
      }),
    );

    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: 'Product added to your cart successfully.',
    });
    navigation.navigate('Cart');
  }, [adding, productId, selectedSize, navigation, dispatch, product]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO IMAGE */}
        <View style={styles.hero}>
          <Image source={product.image} style={styles.heroImage} />

          <View style={styles.headerOverlay}>
            <TopHeader isBack={true} favIcon />
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.body}>
          {/* Category pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          {/* Title + price */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{product.price}</Text>
          </View>

          {/* Size selector */}
          {(sizesLoading || sizes.length > 0) && (
            <View style={styles.sizeSection}>
              <View style={styles.sizeHeaderRow}>
                <Text style={styles.descHeading}>Available sizes</Text>
                {!!selectedSize && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>{selectedSize}</Text>
                  </View>
                )}
              </View>

              {sizesLoading && sizes.length === 0 ? (
                <ActivityIndicator
                  color={colors.lightbrown}
                  style={{ alignSelf: 'flex-start', marginTop: height * 0.005 }}
                />
              ) : (
                <View style={styles.sizeRow}>
                  {sizes.map(size => {
                    const active = size === selectedSize;
                    return (
                      <TouchableOpacity
                        key={size}
                        activeOpacity={0.85}
                        onPress={() => setSelectedSize(size)}
                        style={[styles.sizeChip, active && styles.sizeChipActive]}
                      >
                        <Text
                          style={[
                            styles.sizeChipText,
                            active && styles.sizeChipTextActive,
                          ]}
                        >
                          {size}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Description */}
          <Text style={styles.descHeading}>Description</Text>
          <Text style={styles.descText}>
            {expanded ? product.description : `${product.description.slice(0, 220)}...`}
            <Text style={styles.readMore} onPress={() => setExpanded(prev => !prev)}>
              {expanded ? ' Read less' : 'Read more'}
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* ADD TO CART */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + height * 0.02 }]}>

        <CustomButton
          text={adding ? 'Adding...' : 'Add To Cart'}
          textColor={colors.white}
          btnHeight={height * 0.065}
          btnWidth={width * 0.85}
          backgroundColor={colors.lightbrown}
          borderRadius={20}
          onPress={handleAddToCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: height * 0.14,
  },

  // Hero
  hero: {
    width: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroImage: {
    width: '100%',
    height: height * 0.42,
    resizeMode: 'cover',
  },
  heroButtons: {
    position: 'absolute',
    left: width * 0.05,
    right: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Body
  body: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.025,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightbrown,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  categoryText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: height * 0.03,
  },
  title: {
    flex: 1,
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginRight: width * 0.03,
  },
  price: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  descHeading: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginBottom: height * 0.015,
  },

  // Size selector
  sizeSection: {
    marginBottom: height * 0.03,
  },
  sizeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  selectedBadge: {
    backgroundColor: colors.lightbrown,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.005,
    borderRadius: 999,
  },
  selectedBadgeText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeChip: {
    minWidth: width * 0.14,
    height: width * 0.14,
    paddingHorizontal: width * 0.03,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E4E4E4',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.03,
    marginBottom: height * 0.012,
  },
  sizeChipActive: {
    backgroundColor: colors.lightbrown,
    borderColor: colors.lightbrown,
  },
  sizeChipText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  sizeChipTextActive: {
    color: colors.white,
  },
  descText: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.md,
    color: '#3D3D3D',
    lineHeight: fontSizes.md * 1.6,
  },
  readMore: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: '#2F80ED',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: height * 0.015,
    backgroundColor: colors.white,
  },
});

export default ProductDetails;
