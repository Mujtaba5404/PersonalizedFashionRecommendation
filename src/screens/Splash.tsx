import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import images from '../assets/Images';
import { width } from '../utilities';

const SPLASH_DURATION = 2500;

const Splash = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={images.Background}
      style={styles.background}
      resizeMode="cover"
    >
      <Image source={images.Logo} style={styles.logo} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    resizeMode: 'contain',
  },
});

export default Splash;
