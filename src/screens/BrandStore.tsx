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
import CustomTextInput from '../components/CustomTextInput';
import TopHeader from '../components/Topheader';
import { apiHelper } from '../services';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

type BrandItem = {
  id: string;
  image: ImageSourcePropType;
  description: string;
  name: string;
  rating: string;
  isFavorite: boolean;
};

// Maps a raw /brands/ item: { id, name, description, image_url, is_favorite }.
// Some image_url values are local Windows paths (e.g. "D:/...") that the device
// can't load — only accept real http(s) URLs, otherwise use a local placeholder.
const mapBrand = (raw: any, index: number): BrandItem => {
  const imageUrl = String(raw?.image_url || '');
  const isRemote = /^https?:\/\//i.test(imageUrl);

  return {
    id: String(raw?.id ?? index),
    image: isRemote ? { uri: imageUrl } : images.khadi,
    name: raw?.name || 'Unknown',
    description: raw?.description || '',
    // API doesn't return a rating yet — show a placeholder so the design matches.
    rating: raw?.rating != null ? `${raw.rating} Rating` : '4.6 Rating',
    isFavorite: Boolean(raw?.is_favorite),
  };
};

const BrandCard = ({
  item,
  onPress,
  onToggleFavorite,
}: {
  item: BrandItem;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}) => {
  // If the remote image fails to load (e.g. private S3 / 403), fall back to the
  // local placeholder instead of showing a blank box.
  const [imageFailed, setImageFailed] = useState(false);
  const imageSource = imageFailed ? images.khadi : item.image;

  return (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
    <View style={styles.cardImageWrap}>
      <Image
        source={imageSource}
        style={styles.cardImage}
        onError={() => setImageFailed(true)}
      />
      <TouchableOpacity
        style={styles.heartButton}
        activeOpacity={0.7}
        onPress={onToggleFavorite}
      >
        <Image source={item.isFavorite ? images.HeartFilled : images.Heart} />
      </TouchableOpacity>
    </View>

    <View style={styles.ratingRow}>
      <Image source={images.Stars} style={{ width: width * 0.04, height: width * 0.04 }} />
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>

    <Text style={styles.cardName}>{item.name}</Text>
    {item.description ? (
      <Text style={styles.cardBy} numberOfLines={2}>
        {item.description}
      </Text>
    ) : null}
  </TouchableOpacity>
  );
};

const Brand = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    const { response, error } = await apiHelper('GET', 'brands/');
    console.log('Brands API Response:', response?.data);
    setLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load brands',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    // Endpoint may return an array or a paginated object ({ results: [...] }).
    const data = response?.data;
    const list: any[] = Array.isArray(data)
      ? data
      : data?.results || data?.brands || data?.data || [];

    setBrands(list.map(mapBrand));

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Brands fetched successfully.',
    });
  }, []);

  // Refetch (and show the loader) every time the screen gains focus.
  useFocusEffect(
    useCallback(() => {
      fetchBrands();
    }, [fetchBrands]),
  );

  const toggleFavorite = useCallback(async (item: BrandItem) => {
    const willFavorite = !item.isFavorite;

    // Optimistically flip the heart, revert if the request fails.
    setBrands(prev =>
      prev.map(b =>
        b.id === item.id ? { ...b, isFavorite: willFavorite } : b,
      ),
    );

    const { error } = await apiHelper(
      'POST',
      `brands/${encodeURIComponent(item.name)}/toggle-favorite`,
    );

    if (error) {
      // Revert on failure.
      setBrands(prev =>
        prev.map(b =>
          b.id === item.id ? { ...b, isFavorite: item.isFavorite } : b,
        ),
      );
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
      text1: willFavorite ? 'Added to favourites' : 'Removed from favourites',
      text2: `${item.name} has been ${
        willFavorite ? 'favourited' : 'unfavourited'
      }.`,
    });
  }, []);

  const filteredBrands = brands.filter(item =>
    item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

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
            onToggleFavorite={() => toggleFavorite(item)}
            onPress={() =>
              navigation.navigate('BrandDetails', {
                image: item.image,
                title: item.name,
                author: item.description,
                brandName: item.name,
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

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.brown}
            style={{ marginTop: height * 0.1 }}
          />
        ) : filteredBrands.length === 0 ? (
          <Text style={styles.emptyText}>No brands found.</Text>
        ) : (
          renderSection('Brands', filteredBrands)
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
    paddingBottom: height * 0.14,
  },
  emptyText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    color: '#7A7A7A',
    textAlign: 'center',
    marginTop: height * 0.1,
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
