

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
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default MainStack;
