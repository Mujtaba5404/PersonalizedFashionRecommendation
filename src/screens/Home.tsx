import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { ensureAuthToken } from '../services/auth';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import CustomTextInput from '../components/CustomTextInput';

type Product = {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating?: string;
  image: ImageSourcePropType;
  isFavorite: boolean;
};

const CATEGORIES = ['All', 'Dresses', 'Coats', 'Shoes', 'Bags'];

// The backend returns `image_url` as a server-local filesystem path which isn't
// reachable from the device, so we fall back to bundled images for anything
// that isn't a real http(s) URL.
const PLACEHOLDERS: ImageSourcePropType[] = [
  images.product1,
  images.product2,
  images.product3,
  images.product4,
  images.product5,
  images.product6,
];

const resolveImage = (rawUrl: string, index: number): ImageSourcePropType => {
  const url = String(rawUrl || '');
  if (/^https?:\/\//i.test(url)) {
    return { uri: url };
  }
  return PLACEHOLDERS[index % PLACEHOLDERS.length];
};

const mapProduct = (raw: any, index: number): Product => ({
  id: String(raw?.id ?? raw?._id ?? index),
  name: raw?.brand_name || raw?.name || raw?.main_category || 'Product',
  price: raw?.price ? `Rs. ${raw.price}` : '',
  oldPrice: raw?.old_price ? `Rs. ${raw.old_price}` : undefined,
  rating: raw?.rating ? String(raw.rating) : undefined,
  image: resolveImage(raw?.image_url, index),
  isFavorite: false,
});

const Home = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    await ensureAuthToken();

    const { response, error } = await apiHelper('GET', 'products/all-products');
    setLoading(false);

    if (error || !response?.data) {
      Toast.show({
        type: 'error',
        text1: 'Could not load products',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    const data = response.data;
    const list: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.data)
          ? data.data
          : [];

    setProducts(list.map(mapProduct));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts]),
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const toggleFavorite = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
    );
  };

  const openProduct = (item: Product) => {
    navigation.navigate('ProductDetails', {
      image: item.image,
      title: item.name,
      price: item.price,
      productId: item.id,
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => openProduct(item)}
    >
      <View style={styles.productImageContainer}>
        <Image source={item.image} style={styles.productImage} />

        {!!item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(item.id)}
          activeOpacity={0.8}
        >
          <Image
            source={item.isFavorite ? images.HeartFilled : images.Heart}
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.productName} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={styles.ratingRow}>
        <Image source={images.Stars} style={{ width: 12, height: 12 }} />
        <Text style={styles.ratingText}>{item.rating || '4.6 Rating'}</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.productPrice}>{item.price}</Text>
        {!!item.oldPrice && (
          <Text style={styles.oldPrice}>{item.oldPrice}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
      <TopHeader isMenu notification isProfile />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello, Jaydon 👋</Text>
          <Text style={styles.summaryText}>Find your perfect style</Text>
        </View>

        {/* SEARCH BAR + FILTER */}
        <View style={styles.searchContainer}>
          <CustomTextInput
            placeholder="Search for products"
            placeholderTextColor={colors.black}
            inputHeight={height * 0.06}
            inputWidth={width * 0.85}
            borderRadius={25}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* PROMO BANNER */}
        <ImageBackground
          source={images.homeslider}
          style={styles.banner}
          imageStyle={styles.bannerImage}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerBadge}>Limited time</Text>
            <Text style={styles.bannerTitle}>New Collection</Text>
            <Text style={styles.bannerSubtitle}>Up to 40% off this week</Text>
            <TouchableOpacity style={styles.bannerButton} activeOpacity={0.85}>
              <Text style={styles.bannerButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
        </View>

        {/* PRODUCTS */}
        <View style={styles.productsSection}>
          {loading ? (
            <ActivityIndicator
              color={colors.lightbrown}
              size="large"
              style={{ marginVertical: height * 0.05 }}
            />
          ) : filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.productsRow}
            />
          ) : (
            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? `No products found for "${searchQuery.trim()}".`
                : 'No products available.'}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
    marginBottom: height * 0.005,
  },
  welcomeText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: '#8A8A8A',
  },
  summaryText: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    marginTop: 2,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.015,
    marginBottom: height * 0.02,
    gap: width * 0.03,
  },
  searchIcon: {
    marginRight: width * 0.025,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.black,
    padding: 0,
  },
  filterButton: {
    width: height * 0.06,
    height: height * 0.06,
    borderRadius: 14,
    backgroundColor: colors.lightbrown,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.lightbrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // Banner
  banner: {
    marginHorizontal: width * 0.05,
    height: height * 0.2,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  bannerImage: {
    borderRadius: 20,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
    backgroundColor: 'rgba(74, 52, 51, 0.35)',
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.xsm,
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: width * 0.03,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: height * 0.01,
  },
  bannerTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.xl,
    color: colors.white,
  },
  bannerSubtitle: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.white,
    marginBottom: height * 0.015,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.01,
    borderRadius: 20,
  },
  bannerButtonText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm,
    color: colors.brown,
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.025,
    width: width * 0.99,
    height: height * 0.065,
  },

  // Categories
  categoryRow: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    gap: width * 0.025,
  },
  chip: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.011,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  chipActive: {
    backgroundColor: colors.lightbrown,
    borderColor: colors.lightbrown,
  },
  chipText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: '#6B6B6B',
  },
  chipTextActive: {
    color: colors.white,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
  },
  sectionTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    top: height * 0.02,
  },
  seeAllText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: colors.marhoon,
  },

  // Products
  productsSection: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.02,
    top: height * 0.03,
  },
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  productCard: {
    width: width * 0.43,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: height * 0.16,
    resizeMode: 'cover',
    borderRadius: 14,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.marhoon,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  discountText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.xsm,
    color: colors.white,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  productName: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
    color: colors.black,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xsm,
    color: colors.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  productPrice: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.md,
    color: colors.marhoon,
  },
  oldPrice: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.xsm,
    color: '#B0B0B0',
    textDecorationLine: 'line-through',
  },
  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
    textAlign: 'center',
    marginVertical: height * 0.05,
  },
});

export default Home;
