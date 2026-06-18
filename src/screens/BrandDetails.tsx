import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import TopHeader from '../components/Topheader';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

type Product = {
  id: string;
  image: ImageSourcePropType;
  name: string;
  collection: string;
};

type BrandDetailsParams = {
  BrandDetails?: {
    image?: ImageSourcePropType;
    date?: string;
    title?: string;
    author?: string;
  };
};

const trendingProducts: Product[] = [
  { id: 'p1', image: images.Heel, name: 'Stilet High Heel', collection: 'Summer collection 2024' },
  { id: 'p2', image: images.Bag, name: 'Satchel Bag', collection: 'Spring collection 2022' },
];

const BrandDetails = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<BrandDetailsParams, 'BrandDetails'>>();

  const brand = {
    image: route.params?.image ?? images.khadi,
    date: route.params?.date ?? '18 Feb, 2023',
    title: route.params?.title ?? 'Different Winter',
    author: route.params?.author ?? 'by Mia Jackson',
  };

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

        <View style={styles.productsRow}>
          {trendingProducts.map((item, index) => (
            <View
              key={item.id}
              style={[styles.productColumn, index === 1 && styles.productColumnOffset]}
            >
              <TouchableOpacity
                style={styles.productImageBox}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    image: item.image,
                    title: item.name,
                    category: item.collection,
                  })
                }
              >
                <Image source={item.image} style={styles.productImage} />
              </TouchableOpacity>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCollection}>{item.collection}</Text>
            </View>
          ))}
        </View>
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
