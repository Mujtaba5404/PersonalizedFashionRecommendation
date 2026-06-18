import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import TopHeader from '../components/Topheader';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import CustomTextInput from '../components/CustomTextInput';

type BrandItem = {
  id: string;
  image: ImageSourcePropType;
  rating: string;
  name: string;
  by: string;
  price: string;
  isFavorite: boolean;
};

const recommendedBrands: BrandItem[] = [
  { id: 'r1', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Devon Lane', price: '$110,00', isFavorite: true },
  { id: 'r2', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Eleanor Pena', price: '$110,00', isFavorite: true },
];

const trendingBrands: BrandItem[] = [
  { id: 't1', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Devon Lane', price: '$110,00', isFavorite: true },
  { id: 't2', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Eleanor Pena', price: '$110,00', isFavorite: true },
  { id: 't3', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Devon Lane', price: '$110,00', isFavorite: true },
  { id: 't4', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Eleanor Pena', price: '$110,00', isFavorite: true },
];

const BrandCard = ({ item, onPress }: { item: BrandItem; onPress?: () => void }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
    <View style={styles.cardImageWrap}>
      <Image source={item.image} style={styles.cardImage} />
      <TouchableOpacity style={styles.heartButton} activeOpacity={0.7}>
        <Image source={images.Heart} style={{ width: '60%', height: '60%' }} />
      </TouchableOpacity>
    </View>

    <View style={styles.ratingRow}>
      <Icon name="star" size={width * 0.04} color="#F5A623" />
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>

    <Text style={styles.cardName}>{item.name}</Text>
    <Text style={styles.cardBy}>{item.by}</Text>
    <Text style={styles.cardPrice}>{item.price}</Text>
  </TouchableOpacity>
);

const Brand = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState('');

  const renderSection = (title: string, data: BrandItem[]) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity activeOpacity={0.7}>
          {/* <Text style={styles.seeAll}>See All</Text> */}
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {data.map(item => (
          <BrandCard
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate('BrandDetails', {
                image: item.image,
                title: item.name,
                author: item.by,
              })
            }
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopHeader isMenu isCart notification isProfile />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <CustomTextInput
            placeholder="Search Brands"
            placeholderTextColor={colors.black}
            inputHeight={height * 0.06}
            inputWidth={width * 0.85}
            borderRadius={25}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {renderSection('Recommend Brands For You', recommendedBrands)}
        {renderSection('Trending Brands', trendingBrands)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  scrollContent: {
    paddingBottom: height * 0.14,
  },

  // Search
  searchContainer: {
    alignItems: 'center',
    marginHorizontal: width * 0.09,
    marginTop: height * 0.01,
    marginBottom: height * 0.025,
    // paddingHorizontal: width * 0.03,
    height: height * 0.065,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: colors.black,
    padding: 0,
  },

  // Section
  section: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.01,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
  },
  seeAll: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm2,
    color: colors.black,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Card
  card: {
    width: width * 0.43,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: width * 0.025,
    marginBottom: height * 0.025,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageWrap: {
    position: 'relative',
    marginBottom: height * 0.012,
  },
  cardImage: {
    width: '100%',
    height: height * 0.16,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  heartButton: {
    position: 'absolute',
    top: width * 0.025,
    right: width * 0.025,
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.015,
    marginBottom: height * 0.006,
  },
  ratingText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: '#5C5C5C',
  },
  cardName: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.md,
    color: colors.black,
    marginBottom: height * 0.003,
  },
  cardBy: {
    fontFamily: fontFamily.UrbanistRegular,
    fontSize: fontSizes.sm,
    color: '#7A7A7A',
    marginBottom: height * 0.006,
  },
  cardPrice: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
});

export default Brand;
