import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import TopHeader from '../components/Topheader';
import { MainStackParamList } from '../navigation/MainStack';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

type Product = {
  id: string;
  name: string;
  price: string;
  image: any;
  sub: string;
};

// Products grouped by the main category id, each tagged with its sub-category id.
const CATALOG: Record<string, Product[]> = {
  casual: [
    { id: 'c1', name: 'Cotton Kurta', price: '$49', image: images.product1, sub: 'ready-to-wear' },
    { id: 'c2', name: 'Casual Shirt', price: '$39', image: images.product2, sub: 'ready-to-wear' },
    { id: 'c3', name: 'Lawn Fabric (3pc)', price: '$59', image: images.product3, sub: 'unstitched' },
    { id: 'c4', name: 'Cambric Suit', price: '$45', image: images.product4, sub: 'unstitched' },
  ],
  seasonal: [
    { id: 's1', name: 'Linen Summer Dress', price: '$55', image: images.product5, sub: 'summer' },
    { id: 's2', name: 'Cotton Tee', price: '$25', image: images.product6, sub: 'summer' },
    { id: 's3', name: 'Wool Sweater', price: '$79', image: images.product1, sub: 'winters' },
    { id: 's4', name: 'Quilted Jacket', price: '$129', image: images.product2, sub: 'winters' },
  ],
  'shadi-wear': [
    { id: 'w1', name: 'Barat Lehenga', price: '$499', image: images.product3, sub: 'barat' },
    { id: 'w2', name: 'Sherwani', price: '$399', image: images.product4, sub: 'barat' },
    { id: 'w3', name: 'Valima Gown', price: '$349', image: images.product5, sub: 'valima' },
    { id: 'w4', name: 'Mehndi Frock', price: '$199', image: images.product6, sub: 'mehndi' },
  ],
};

type CategoryProductsRoute = RouteProp<MainStackParamList, 'CategoryProducts'>;

const CategoryProducts = () => {
  const route = useRoute<CategoryProductsRoute>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { category, categoryName, subCategory, subCategoryName } = route.params ?? {};

  const allProducts = (category && CATALOG[category]) || [];
  // If a sub-category was chosen, narrow the list down to it.
  const products = subCategory
    ? allProducts.filter(p => p.sub === subCategory)
    : allProducts;

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} activeOpacity={0.8}>
      <View style={styles.productImageContainer}>
        <Image source={item.image} style={styles.productImage} />
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <TopHeader text={categoryName || 'Products'} isBack />

      <View style={styles.headingWrap}>
        <Text style={styles.heading}>
          {categoryName || 'Category'}
          {subCategoryName ? ` • ${subCategoryName}` : ''}
        </Text>
        <Text style={styles.subHeading}>
          {products.length} item{products.length === 1 ? '' : 's'} found
        </Text>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productsRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No products found for this selection.</Text>
        </View>
      )}

      <View style={styles.btnMain}>
        <CustomButton
          text="Continue"
          textColor={colors.white}
          btnHeight={height * 0.065}
          btnWidth={width * 0.85}
          backgroundColor={colors.lightbrown}
          borderRadius={20}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  headingWrap: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  heading: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
  },
  subHeading: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.marhoon,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
  },
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  productCard: {
    width: width * 0.43,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: height * 0.12,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  productName: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: colors.black,
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm,
    color: colors.marhoon,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.1,
  },
  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
    textAlign: 'center',
  },
  btnMain: {
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
});

export default CategoryProducts;
