import {
  useRoute,
  RouteProp,
  useNavigation,
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
import Toast from 'react-native-toast-message';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

type Product = {
  id: string;
  image: ImageSourcePropType;
  name: string;
  collection: string;
  price: string;
};

type BrandDetailsParams = {
  BrandDetails?: {
    image?: ImageSourcePropType;
    date?: string;
    title?: string;
    author?: string;
    brandName?: string;
  };
};

const mapProduct = (raw: any, index: number): Product => {
  const imageUrl = String(raw?.image_url || '');
  const isRemote = /^https?:\/\//i.test(imageUrl);

  return {
    id: String(raw?.id ?? index),
    image: isRemote ? { uri: imageUrl } : images.khadi,
    name: raw?.sub_category || raw?.main_category || 'Product',
    collection: raw?.main_category || '',
    price: raw?.price ? `Rs. ${raw.price}` : '',
  };
};

const BrandDetails = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<BrandDetailsParams, 'BrandDetails'>>();

  const brand = {
    image: route.params?.image ?? images.khadi,
    date: route.params?.date ?? '18 Feb, 2023',
    title: route.params?.title ?? 'Different Winter',
    author: route.params?.author ?? 'by Mia Jackson',
  };

  const brandName = route.params?.brandName ?? route.params?.title;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!brandName) return;

    setLoading(true);
    const { response, error } = await apiHelper(
      'GET',
      `brands/${encodeURIComponent(brandName)}/products`,
    );
    setLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load products',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    const data = response?.data;
    const list: any[] = Array.isArray(data)
      ? data
      : data?.results || data?.products || data?.data || [];

    setProducts(list.map(mapProduct));

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Trending products fetched successfully.',
    });
  }, [brandName]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts]),
  );

  // Split into two staggered columns to keep the original masonry look
  const leftColumn = products.filter((_, i) => i % 2 === 0);
  const rightColumn = products.filter((_, i) => i % 2 === 1);

  const renderProduct = (item: Product) => (
    <View key={item.id} style={styles.productCard}>
      <TouchableOpacity
        style={styles.productImageBox}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('ProductDetails', {
            image: item.image,
            title: item.name,
            category: item.collection,
            price: item.price,
            productId: item.id,
          })
        }
      >
        <Image source={item.image} style={styles.productImage} />
      </TouchableOpacity>
      <Text style={styles.productName}>{item.name}</Text>
      {!!item.price && <Text style={styles.productCollection}>{item.price}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HERO (fixed) */}
      <View style={styles.hero}>
        <Image source={brand.image} style={styles.heroImage} />

        {/* Back + favourite (from TopHeader) */}
        <View style={styles.headerOverlay}>
          <TopHeader isBack={true} favIcon />
        </View>

        {/* Caption */}
        <View style={styles.heroCaption}>
          <Text style={styles.heroDate}>{brand.date}</Text>
          <Text style={styles.heroTitle}>{brand.title}</Text>
          <Text style={styles.heroAuthor}>{brand.author}</Text>
        </View>
      </View>

      {/* TRENDING PRODUCTS (scrollable) */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Trending Products</Text>

        {loading && products.length === 0 ? (
          <ActivityIndicator
            color={colors.black}
            style={{ marginTop: height * 0.05 }}
          />
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>No products available.</Text>
        ) : (
          <View style={styles.productsRow}>
            <View style={styles.productColumn}>
              {leftColumn.map(renderProduct)}
            </View>
            <View style={[styles.productColumn, styles.productColumnOffset]}>
              {rightColumn.map(renderProduct)}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: height * 0.05,
  },

  // Hero
  hero: {
    backgroundColor: colors.lightbrown,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: height * 0.025,
  },
  heroImage: {
    width: '100%',
    height: height * 0.45,
    resizeMode: 'cover',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  // heartButton: {
  //   position: 'absolute',
  //   right: width * 0.05,
  //   width: width * 0.12,
  //   height: width * 0.12,
  //   borderRadius: width * 0.06,
  //   backgroundColor: colors.white,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  heroCaption: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.018,
  },
  heroDate: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.white,
    marginBottom: height * 0.006,
  },
  heroTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.xl,
    color: colors.white,
    marginBottom: height * 0.004,
  },
  heroAuthor: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.white,
  },

  // Trending products
  sectionTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    paddingHorizontal: width * 0.06,
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  productsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06,
  },
  productColumn: {
    width: width * 0.42,
  },
  productColumnOffset: {
    marginTop: height * 0.06,
  },
  productCard: {
    marginBottom: height * 0.025,
  },
  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: height * 0.05,
  },
  productImageBox: {
    width: '100%',
    height: height * 0.26,
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.015,
  },
  productImage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  productName: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginBottom: height * 0.004,
  },
  productCollection: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: '#8A8A8A',
  },
});

export default BrandDetails;
