import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
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

type FavouriteItem = {
  id: string;
  image: ImageSourcePropType;
  rating: string;
  name: string;
  by: string;
  price: string;
  hasAdd: boolean;
};

const favouriteItems: FavouriteItem[] = [
  { id: 'f1', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Devon Lane', price: '$110,00', hasAdd: true },
  { id: 'f2', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Eleanor Pena', price: '$110,00', hasAdd: true },
  { id: 'f3', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Devon Lane', price: '$110,00', hasAdd: false },
  { id: 'f4', image: images.khadi, rating: '4.6 Rating', name: 'Dummy Text', by: 'By Eleanor Pena', price: '$110,00', hasAdd: false },
];

const FavouriteCard = ({
  item,
  onPress,
}: {
  item: FavouriteItem;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
    <View style={styles.cardImageWrap}>
      <Image source={item.image} style={styles.cardImage} />
      <TouchableOpacity style={styles.heartButton} activeOpacity={0.7}>
        <Image source={images.Heart} style={styles.heartIcon} />
      </TouchableOpacity>
    </View>

    <View style={styles.ratingRow}>
      <Icon name="star" size={width * 0.04} color="#F5A623" />
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>

    <Text style={styles.cardName}>{item.name}</Text>
    <Text style={styles.cardBy}>{item.by}</Text>

    {item.hasAdd ? (
      <View style={styles.priceRow}>
        <Text style={styles.cardPrice}>{item.price}</Text>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Text style={styles.cardPrice}>{item.price}</Text>
    )}
  </TouchableOpacity>
);

const Favorite = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <TopHeader isMenu isCart notification isProfile />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {favouriteItems.map(item => (
            <FavouriteCard
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
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.14,
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
  heartIcon: {
    width: '55%',
    height: '55%',
    resizeMode: 'contain',
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
    marginBottom: height * 0.008,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  addButton: {
    backgroundColor: colors.brown,
    borderRadius: 10,
    paddingHorizontal: width * 0.045,
    paddingVertical: height * 0.009,
  },
  addButtonText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm2,
    color: colors.white,
  },
});

export default Favorite;
