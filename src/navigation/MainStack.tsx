

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Onboarding from '../screens/Onboarding';
import Register from '../screens/Register';
import SignInEmail from '../screens/SignInEmail';
import Registeration from '../screens/Registeration';

export type MainStackParamList = {
  Onboarding: undefined;
  Register: undefined;
  SignInEmail: undefined;
  Registeration: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="SignInEmail" component={SignInEmail} />
      <Stack.Screen name="Registeration" component={Registeration} />
    </Stack.Navigator>
  );
};

export default MainStack;
