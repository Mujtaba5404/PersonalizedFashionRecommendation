// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;




import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainStack from './src/navigation/MainStack';
import { colors } from './src/utilities/colors';
import { StyleSheet } from 'react-native';


const App = () => {
  return (
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toastContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.marhoon,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  text1: {
    fontSize: 15,
    color: colors.black,
  },
  text2: {
    fontSize: 14,
    color: colors.black,
    marginTop: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default App;
