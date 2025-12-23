
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import CustomButton from '../components/CustomButton';
import TopHeader from '../components/Topheader';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import { useState, useRef } from 'react';

const Home = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Slider images data 
  const sliderImages = [
    { 
      id: '1', 
      image: images.slider3,
      title: 'Prada Glass',
      subtitle: 'Summer collection 2024'
    },
    { 
      id: '2', 
      image: images.slider1, // دوسری لڑکی کی تصویر
      title: 'Satchel Bag',
      subtitle: 'New Arrivals'
    },
    { 
      id: '3', 
      image: images.slider2, // تیسری لڑکی کی تصویر
      title: 'Designer Wear',
      subtitle: 'Luxury Collection'
    },
  ];

  // Products data
  const products = [
    { id: '1', name: 'Prada Glass', price: '$299', image: images.product1, isFavorite: false },
    { id: '2', name: 'Satchel Bag', price: '$199', image: images.product2, isFavorite: true },
    { id: '3', name: 'Summer Dress', price: '$159', image: images.product3, isFavorite: false },
    { id: '4', name: 'Sunglasses', price: '$129', image: images.product4, isFavorite: true },
  ];

  // Handle scroll for dots
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const renderSliderItem = ({ item }: { item: any }) => (
    <View style={styles.sliderItem}>
      <Image source={item.image} style={styles.sliderImage} />
    </View>
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={item.image} style={styles.productImage} />
        <TouchableOpacity style={styles.heartButton}>
          <Image 
            source={item.isFavorite ? images.heartFilled : images.heartOutline} 
            style={styles.heartIcon} 
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
      <TopHeader isMenu={true} notification={true} isProfile={true} />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello, Jaydon</Text>
          <Text style={styles.summaryText}>Today's Summary</Text>
        </View>

        
        <View style={styles.sliderContainer}>
          <Image source={images.homeslider} style={styles.image}>
          </Image>

          <View style={styles.dotsContainer}>
            {sliderImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                  setCurrentIndex(index);
                }}
              >
                <View 
                  style={[
                    styles.dot, 
                    index === currentIndex && styles.activeDot
                  ]} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Products Grid Section */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested Products</Text>
          </View>
          
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.productsRow}
            contentContainerStyle={styles.productsGrid}
          />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  welcomeText: {
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.xl,
    color: colors.black,
  },
  summaryText: {
    fontFamily: fontFamily.UrbanistExtraBold,
    fontSize: fontSizes.lg2,
    color: colors.black,
    marginTop: 5,
  },

  sliderContainer: {
    height: height * 0.35,
    marginBottom: height * 0.02,
  },
  sliderItem: {
    width: width,
    height: '100%',
    position: 'relative',
    
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  sliderTextOverlay: {
    position: 'absolute',
    bottom: height * 0.05,
    left: width * 0.05,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sliderTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.white,
  },
  sliderSubtitle: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.9,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 20,
  },
  // Products Section
  productsSection: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.03,
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
  seeAllText: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.sm,
    color: colors.marhoon,
  },
  productsGrid: {
    paddingBottom: height * 0.01,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: height * 0.12,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  heartButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
  heartIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
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
  // Tools Section
  toolsSection: {
    backgroundColor: colors.white,
    marginHorizontal: width * 0.05,
    borderRadius: 18,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.05,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  toolsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  toolsTitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
    color: colors.black,
  },
  toolsHeartIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  toolsSubtitle: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginLeft: width * 0.05,
    marginBottom: height * 0.03,
  },
  startButtonContainer: {
    marginLeft: width * 0.05,
  },
  startButton: {
    backgroundColor: colors.marhoon,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    width: width * 0.35,
  },
  startButtonText: {
    fontFamily: fontFamily.GilroyMedium,
    fontSize: fontSizes.md,
    color: colors.white,
  },
  image:{
    alignSelf: 'center'
  }
});

export default Home;