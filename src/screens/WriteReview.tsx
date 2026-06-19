import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
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
import CustomButton from '../components/CustomButton';

const STAR_COLOR = '#F7941D';

const WriteReview = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // TODO: hook up to review submission API
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={images.Background}
      style={styles.imgbg}
      resizeMode="cover"
    >
      <TopHeader text="Write a review" isBack={true} />

      <View style={styles.container}>
        {/* Brand logo overlapping the card */}
        <Image source={images.khadi} style={styles.brandLogo} />

        <View style={styles.card}>
          <Text style={styles.brandName}>Khaaddi</Text>

          <Text style={styles.title}>How was your experience?</Text>
          <Text style={styles.subtitle}>Your feedback helps us improve!</Text>

          {/* Interactive stars */}
          <View style={styles.starsRow}>

            <Image
              source={images.Stars}
            />

          </View>

          {/* Comments */}
          <TextInput
            style={styles.commentInput}
            placeholder="Additional comments..."
            placeholderTextColor="#6B6B6B"
            multiline
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
        </View>
      </View>

      <View style={{ marginBottom: height * 0.04, alignItems: 'center' }}>
        <CustomButton
          text="Submit Review"
          textColor={colors.white}
          backgroundColor={colors.lightbrown}
          borderRadius={20}
          btnWidth={width * 0.85}
          btnHeight={height * 0.06}
          fontSize={fontSizes.md}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgbg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.06,
    alignItems: 'center',
  },
  brandLogo: {
    borderRadius: 100,
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'cover',
    zIndex: 2,
    marginBottom: -width * 0.15,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingTop: width * 0.18,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.04,
    alignItems: 'center',
  },
  brandName: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.lg,
    color: colors.black,
    marginBottom: height * 0.008,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
    marginBottom: height * 0.03,
  },
  ratingText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.sm2,
    color: colors.black,
  },
  title: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontFamily: fontFamily.UrbanistMedium,
    fontSize: fontSizes.md,
    fontStyle: 'italic',
    color: '#8A8A8A',
    textAlign: 'center',
    marginBottom: height * 0.035,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.04,
  },
  starButton: {
    paddingHorizontal: width * 0.012,
  },
  commentInput: {
    width: '100%',
    minHeight: height * 0.18,
    backgroundColor: colors.gray,
    borderRadius: 16,
    padding: width * 0.04,
    fontFamily: fontFamily.UrbanistSemiBold,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  submitButton: {
    backgroundColor: colors.lightbrown,
    borderRadius: 30,
    paddingVertical: height * 0.022,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.04,
  },
  submitText: {
    fontFamily: fontFamily.UrbanistBold,
    fontSize: fontSizes.md,
    color: colors.white,
  },
});

export default WriteReview;
