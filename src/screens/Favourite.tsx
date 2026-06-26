import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
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
import Icon from 'react-native-vector-icons/Ionicons';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

type FavouriteItem = {
  id: string;
  image: ImageSourcePropType;
  rating: string;
  name: string;
  by: string;
};

// Maps a raw /brands/favorites item: { id, name, description, image_url, rating }.
// Some image_url values are local paths (e.g. "D:/...") the device can't load —
// only accept real http(s) URLs, otherwise fall back to a local placeholder.
const mapFavourite = (raw: any, index: number): FavouriteItem => {
  const imageUrl = String(raw?.image_url || '');
  const isRemote = /^https?:\/\//i.test(imageUrl);

  return {
    id: String(raw?.id ?? index),
    image: isRemote ? { uri: imageUrl } : images.khadi,
    name: raw?.name || 'Unknown',
    by: raw?.description || '',
    rating: raw?.rating != null ? `${raw.rating} Rating` : '4.6 Rating',
  };
};

const FavouriteCard = ({
  item,
  onPress,
  onToggleFavorite,
}: {
  item: FavouriteItem;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
    <View style={styles.cardImageWrap}>
      <Image source={item.image} style={styles.cardImage} />
      <TouchableOpacity
        style={styles.heartButton}
        activeOpacity={0.7}
        onPress={onToggleFavorite}
      >
        {/* Items here are all favourites — show the filled heart. */}
        <Image source={images.HeartFilled} style={styles.heartIcon} />
      </TouchableOpacity>
    </View>

    <View style={styles.ratingRow}>
      <Icon name="star" size={width * 0.04} color="#F5A623" />
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>

    <Text style={styles.cardName}>{item.name}</Text>
    {item.by ? (
      <Text style={styles.cardBy} numberOfLines={2}>
        {item.by}
      </Text>
    ) : null}
  </TouchableOpacity>
);

const Favorite = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavourites = useCallback(async () => {
    setLoading(true);
    const { response, error } = await apiHelper('GET', 'brands/favorites');
    console.log('Favourites API Response:', response?.data);
    setLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load favourites',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    // Endpoint may return an array or a wrapped object ({ results: [...] }).
    const data = response?.data;
    const list: any[] = Array.isArray(data)
      ? data
      : data?.results || data?.favorites || data?.brands || data?.data || [];

    setFavourites(list.map(mapFavourite));

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Favourites fetched successfully.',
    });
  }, []);

  // Refetch on focus so newly (un)favourited brands stay in sync.
  useFocusEffect(
    useCallback(() => {
      fetchFavourites();
    }, [fetchFavourites]),
  );

  const unfavorite = useCallback(async (item: FavouriteItem) => {
    // Optimistically remove the card; restore it if the request fails.
    setFavourites(prev => prev.filter(f => f.id !== item.id));

    const { error } = await apiHelper(
      'POST',
      `brands/${encodeURIComponent(item.name)}/toggle-favorite`,
    );

    if (error) {
      // Restore on failure.
      setFavourites(prev => [...prev, item]);
      Toast.show({
        type: 'error',
        text1: 'Failed to update favourite',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Removed from favourites',
      text2: `${item.name} has been unfavourited.`,
    });
  }, []);

  return (
    <View style={styles.container}>
      <TopHeader isMenu isCart notification isProfile />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.brown}
            style={styles.loader}
          />
        ) : favourites.length === 0 ? (
          <Text style={styles.emptyText}>No favourites yet.</Text>
        ) : (
          <View style={styles.grid}>
            {favourites.map(item => (
              <FavouriteCard
                key={item.id}
                item={item}
                onToggleFavorite={() => unfavorite(item)}
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
        )}
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
  loader: {
    marginTop: height * 0.3,
  },
  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: '#7A7A7A',
    textAlign: 'center',
    marginTop: height * 0.3,
  },
});

export default Favorite;
