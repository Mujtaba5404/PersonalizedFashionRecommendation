import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { fontFamily } from '../assets/Fonts';
import CustomButton from '../components/CustomButton';
import TopHeader from '../components/Topheader';
import { height, width } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';
import { useState } from 'react';
import images from '../assets/Images';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You may need to install this

const FAQS = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  
  // FAQ data - you can expand this with more questions
  const faqData = [
    {
      id: 1,
      question: "Lorem Ipsum is simply dummy text of the printing and typesetting industry?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      isExpanded: true
    },
    {
      id: 2,
      question: "Lorem Ipsum is simply dummy text of the printing and typesetting industry?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry?",
      bulletPoints: [
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry?"
      ],
      isExpanded: false
    },
    // Add more FAQ items as needed
  ];

  const [faqs, setFaqs] = useState(faqData);

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isExpanded: !faq.isExpanded } : faq
    ));
  };

  return (
    <ImageBackground
      source={images.Background}
      style={styles.imgbg}
      resizeMode="cover"
    >
      <TopHeader text="FAQ's" isBack={true} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.mainContainer}>
          
          {faqs.map((faq, index) => (
            <View key={faq.id} style={styles.faqContainer}>
              {/* FAQ Question */}
              <TouchableOpacity 
                style={styles.questionContainer}
                onPress={() => toggleFAQ(faq.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>
                  {faq.question}
                </Text>
                {/* <Icon 
                  name={faq.isExpanded ? 'expand-less' : 'expand-more'} 
                  size={24} 
                  color={colors.black}
                /> */}
                <Image
                source={images.arrowdown}
                />
              </TouchableOpacity>
              
              {/* FAQ Answer - only show if expanded */}
              {faq.isExpanded && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>
                    {faq.answer}
                  </Text>
                  
                  {/* Render bullet points if they exist */}
                  {faq.bulletPoints && faq.bulletPoints.map((point, idx) => (
                    <View key={idx} style={styles.bulletPointContainer}>
                      <View style={styles.bulletPoint}>
                        <Text style={styles.bulletPointText}>•</Text>
                      </View>
                      <Text style={styles.bulletPointTextContent}>
                        {point}
                      </Text>
                    </View>
                  ))}
                  
                  {/* Divider line */}
                  {index < faqs.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              )}
            </View>
          ))}
          
          {/* Add more spacing at the bottom */}
          <View style={{ height: height * 0.05 }} />
        </View>
      </ScrollView>


    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgbg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: height * 0.1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  pageTitle: {
    fontFamily: fontFamily.GilroyBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    textAlign: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.01,
  },
  faqContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: height * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    backgroundColor: colors.gray,
  },
  questionText: {
    fontFamily: fontFamily.GilroySemiBold,
    fontSize: fontSizes.sm2,
    color: colors.black,
    flex: 1,
    marginRight: width * 0.02,
  },
  answerContainer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    backgroundColor: colors.white,
  },
  answerText: {
    fontFamily: fontFamily.GilroyRegular,
    fontSize: fontSizes.sm,
    color: colors.black,
    textAlign: 'justify',
    lineHeight: height * 0.024,
    marginBottom: height * 0.01,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: width * 0.02,
    marginTop: height * 0.005,
  },
  bulletPoint: {
    marginRight: width * 0.02,
    marginTop: height * 0.002,
  },
  bulletPointText: {
    fontFamily: fontFamily.GilroyBold,
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  bulletPointTextContent: {
    fontFamily: fontFamily.GilroyRegular,
    fontSize: fontSizes.sm,
    color: colors.black,
    flex: 1,
    textAlign: 'justify',
    lineHeight: height * 0.024,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightgrey,
    marginTop: height * 0.025,
    marginHorizontal: -width * 0.04,
  },
  btn: {
    alignSelf: 'center',
    marginBottom: height * 0.04,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default FAQS;