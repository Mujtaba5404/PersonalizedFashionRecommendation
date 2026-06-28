

import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import Register from '../screens/Register';
import SignInEmail from '../screens/SignInEmail';
import Registeration from '../screens/Registeration';
import ForgotPassword from '../screens/ForgotPassword';
import SetNewPassword from '../screens/SetNewPassword';
import OtpVerification from '../screens/OtpVerification';
import CreateProfile from '../screens/CreateProfile';
import Home from '../screens/Home';
import Brand from '../screens/BrandStore';
import BrandDetails from '../screens/BrandDetails';
import ProductDetails from '../screens/ProductDetails';
import Cart from '../screens/Cart';
import Checkout from '../screens/Checkout';
import AddDeliveryAddress, { DeliveryAddress } from '../screens/AddDeliveryAddress';
import OrderSuccess from '../screens/OrderSuccess';
import Favorite from '../screens/Favourite';
import BottomTabs from './BottomTabs';
import EditProfile from '../screens/EditProfile';
import Profile from '../screens/Profile';
import ChangePassword from '../screens/ChangePassword';
import TermsConditions from '../screens/TermsAndCondition';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import FAQS from '../screens/Faqs';
import CustomerSupport from '../screens/CustomerSupport';
import OrdersHistory from '../screens/OrdersHistory';
import WriteReview from '../screens/WriteReview';
import PaymentMethods from '../screens/PaymentMethods';
import MyOrders from '../screens/MyOrders';
import CategoryProducts from '../screens/CategoryProducts';
import RecommendedProducts from '../screens/RecommendedProducts';
import ARTryOn from '../screens/ARTryOn';
import NotificationsScreen from '../screens/NotificationsScreen';

export type MainStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Register: undefined;
  SignInEmail: undefined;
  Registeration: undefined;
  ForgotPassword: undefined;
  SetNewPassword: undefined;
  OtpVerification: undefined;
  CreateProfile: undefined;
  Home: undefined;
  Brand: undefined;
  BrandDetails:
    | {
        image?: number;
        date?: string;
        title?: string;
        author?: string;
      }
    | undefined;
  ProductDetails:
    | {
        image?: number;
        category?: string;
        title?: string;
        price?: string;
        description?: string;
      }
    | undefined;
  Cart: undefined;
  Checkout: { address?: DeliveryAddress } | undefined;
  AddDeliveryAddress: { address?: DeliveryAddress } | undefined;
  OrderSuccess: undefined;
  Favorite: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  TermsConditions:undefined;
  PrivacyPolicy: undefined;
  FAQS: undefined;
  CustomerSupport: undefined;
  OrdersHistory: undefined;
  WriteReview: { brandName?: string } | undefined;
  PaymentMethods: undefined;
  MyOrders: undefined;
  NotificationsScreen: undefined;
  CategoryProducts: {
    category: string;
    categoryName: string;
    subCategory?: string;
    subCategoryName?: string;
  };
  RecommendedProducts: {
    category: string;
    categoryName?: string;
    detectedTone?: string;
    detectedHex?: string;
  };
  ARTryOn:
    | {
        productId?: number | string;
        title?: string;
        price?: string;
        brand?: string;
        dressImage?: ImageSourcePropType;
      }
    | undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="SignInEmail" component={SignInEmail} />
      <Stack.Screen name="Registeration" component={Registeration} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="Home" component={BottomTabs} />
      <Stack.Screen name="Brand" component={Brand} />
      <Stack.Screen name="BrandDetails" component={BrandDetails} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="AddDeliveryAddress" component={AddDeliveryAddress} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
      <Stack.Screen name="Favorite" component={Favorite} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="FAQS" component={FAQS} />
      <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
      <Stack.Screen name="OrdersHistory" component={OrdersHistory} />
      <Stack.Screen name="WriteReview" component={WriteReview} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
      <Stack.Screen name="RecommendedProducts" component={RecommendedProducts} />
      <Stack.Screen name="ARTryOn" component={ARTryOn} />
    </Stack.Navigator>
  );
};

export default MainStack;
