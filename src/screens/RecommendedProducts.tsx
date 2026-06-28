import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import CustomButton from '../components/CustomButton';
import TopHeader from '../components/Topheader';
import { MainStackParamList } from '../navigation/MainStack';
import { apiHelper } from '../services';
import { ensureAuthToken } from '../services/auth';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

// The backend returns `image_url` as a server-local filesystem path
// (e.g. D:/Tonefit_Project/...), which isn't reachable from the device. Until
// the API serves real URLs we fall back to these bundled images so the grid and
// the AR overlay always show a real garment.
const PLACEHOLDERS: ImageSourcePropType[] = [
  images.product1,
  images.product2,
  images.product3,
  images.product4,
  images.product5,
  images.product6,
];

type Outfit = {
  id: number | string;
  name: string;
  price: string;
  brand: string;
  image: ImageSourcePropType;
};

type StyleGuide = {
  colors: string[];
  hexes: string[];
  advice: string;
};

const resolveImage = (rawUrl: string, index: number): ImageSourcePropType => {
  const url = String(rawUrl || '');
  if (/^https?:\/\//i.test(url)) {
    return { uri: url };
  }
  return PLACEHOLDERS[index % PLACEHOLDERS.length];
};

type RecommendedRoute = RouteProp<MainStackParamList, 'RecommendedProducts'>;

const RecommendedProducts = () => {
  const route = useRoute<RecommendedRoute>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { category, categoryName, detectedTone, detectedHex } = route.params ?? {};

  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [tone, setTone] = useState<string>(detectedTone ?? '');
  const [toneHex, setToneHex] = useState<string>(detectedHex ?? '');
  const [styleGuide, setStyleGuide] = useState<StyleGuide | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!category) return;

    setLoading(true);
    await ensureAuthToken();

    const { response, error } = await apiHelper(
      'GET',
      'skintone/recommendations',
      { category },
    );
    setLoading(false);

    if (error || !response?.data) {
      Toast.show({
        type: 'error',
        text1: 'Could not load recommendations',
        text2:
          typeof error === 'string'
            ? error
            : (error as any)?.detail || 'Please try again.',
      });
      return;
    }

    const data = response.data;
    const profile = data.user_profile ?? {};
    if (profile.detected_tone) setTone(profile.detected_tone);
    if (profile.detected_hex) setToneHex(profile.detected_hex);

    const guide = data.style_guide ?? {};
    setStyleGuide({
      colors: Array.isArray(guide.suggested_colors) ? guide.suggested_colors : [],
      hexes: Array.isArray(guide.hex_codes) ? guide.hex_codes : [],
      advice: guide.expert_advice ?? '',
    });

    const list: any[] = Array.isArray(data.recommended_outfits)
      ? data.recommended_outfits
      : Array.isArray(data.recommendations)
      ? data.recommendations
      : [];

    setOutfits(
      list.map((raw, index) => ({
        id: raw?.id ?? index,
        name: raw?.brand_name || raw?.main_category || 'Outfit',
        price: raw?.price ? `Rs. ${raw.price}` : '',
        brand: raw?.brand_name || '',
        image: resolveImage(raw?.image_url, index),
      })),
    );
  }, [category]);

  useFocusEffect(
    useCallback(() => {
      fetchRecommendations();
    }, [fetchRecommendations]),
  );

  const openTryOn = (item: Outfit) => {
    navigation.navigate('ARTryOn', {
      productId: item.id,
      title: item.name,
      price: item.price,
      brand: item.brand,
      dressImage: item.image,
    });
  };

  const renderItem = ({ item }: { item: Outfit }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => openTryOn(item)}
    >
      <View style={styles.cardImageWrap}>
        <Image source={item.image} style={styles.cardImage} />
        <View style={styles.tryOnBadge}>
          <Text style={styles.tryOnBadgeText}>Try On</Text>
        </View>
      </View>
      <Text style={styles.cardName} numberOfLines={1}>
        {item.name}
      </Text>
      {!!item.price && <Text style={styles.cardPrice}>{item.price}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <TopHeader text="Recommended For You" isBack />

      {/* Skin-tone summary */}
      <View style={styles.toneRow}>
        {!!toneHex && (
          <View style={[styles.toneSwatch, { backgroundColor: toneHex }]} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.toneTitle}>
            Your tone: {tone || 'Detected'}
          </Text>
          <Text style={styles.toneSub}>
            {categoryName || category} · curated picks
          </Text>
        </View>
      </View>

      {/* Style guide */}
      {styleGuide && (styleGuide.colors.length > 0 || !!styleGuide.advice) && (
        <View style={styles.guideBox}>
          {styleGuide.colors.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.guideSwatches}
            >
              {styleGuide.colors.map((name, i) => (
                <View key={`${name}-${i}`} style={styles.guideSwatchItem}>
                  <View
                    style={[
                      styles.guideSwatch,
                      { backgroundColor: styleGuide.hexes[i] || colors.lightGray },
                    ]}
                  />
                  <Text style={styles.guideSwatchText}>{name}</Text>
                </View>
              ))}
            </ScrollView>
          )}
          {!!styleGuide.advice && (
            <Text style={styles.guideAdvice}>{styleGuide.advice}</Text>
          )}
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.lightbrown} size="large" />
        </View>
      ) : outfits.length > 0 ? (
        <FlatList
          data={outfits}
          renderItem={renderItem}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No recommendations found for this category.
          </Text>
        </View>
      )}

      <View style={styles.footer}>
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
  toneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
    gap: width * 0.03,
  },
  toneSwatch: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    borderWidth: 2,
    borderColor: colors.white,
  },
  toneTitle: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  toneSub: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.marhoon,
    marginTop: 2,
  },
  guideBox: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.015,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
  },
  guideSwatches: {
    gap: width * 0.04,
    paddingRight: width * 0.04,
  },
  guideSwatchItem: {
    alignItems: 'center',
    width: width * 0.16,
  },
  guideSwatch: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    marginBottom: 6,
  },
  guideSwatchText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm2,
    color: colors.black,
    textAlign: 'center',
  },
  guideAdvice: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: '#444',
    marginTop: height * 0.012,
    lineHeight: fontSizes.sm * 1.5,
  },
  listContent: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.03,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  card: {
    width: width * 0.43,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    height: height * 0.16,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  tryOnBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.lightbrown,
    paddingHorizontal: width * 0.025,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tryOnBadgeText: {
    color: colors.white,
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
  },
  cardName: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.sm,
    color: colors.black,
    marginBottom: 2,
  },
  cardPrice: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm,
    color: colors.marhoon,
  },
  center: {
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
  footer: {
    alignItems: 'center',
    paddingVertical: height * 0.015,
    backgroundColor: colors.lightGray,
  },
});

export default RecommendedProducts;
