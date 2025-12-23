

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
import Favorite from '../screens/Favourite';
import BottomTabs from './BottomTabs';
import EditProfile from '../screens/EditProfile';
import Profile from '../screens/Profile';
import ChangePassword from '../screens/ChangePassword';
import TermsConditions from '../screens/TermsAndCondition';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import FAQS from '../screens/Faqs';

export type MainStackParamList = {
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
  Favorite: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  TermsConditions:undefined;
  PrivacyPolicy: undefined;
  FAQS: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
      <Stack.Screen name="Favorite" component={Favorite} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="FAQS" component={FAQS} />
    </Stack.Navigator>
  );
};

export default MainStack;
