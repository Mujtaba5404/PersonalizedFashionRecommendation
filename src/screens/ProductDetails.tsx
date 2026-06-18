import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
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
  };
};

const DESCRIPTION =
  "dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const ProductDetails = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<ProductDetailsParams, 'ProductDetails'>>();
  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const product = {
    image: route.params?.image ?? images.khadi,
    category: route.params?.category ?? 'Interpersonal Therapy',
    title:
      route.params?.title ??
      'Lorem Ipsum Dolor Sit Amet Consectetur. Dictum Sapien In Phasellus Rhoncus Commodo.',
    price: route.params?.price ?? '$4,500 USD',
    description: route.params?.description ?? DESCRIPTION,
  };

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
          text="Add To Cart"
          textColor={colors.white}
          btnHeight={height * 0.065}
          btnWidth={width * 0.85}
          backgroundColor={colors.lightbrown}
          borderRadius={20}
          onPress={() => navigation.navigate('Cart')}
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
    fontSize: fontSizes.lg2,
    color: colors.black,
    marginBottom: height * 0.015,
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
