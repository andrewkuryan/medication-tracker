import React from 'react';
import { SafeAreaView, Text, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import styles from './App.styles.ts';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ ...styles.appRoot, ...backgroundStyle }}>
        <Text style={styles.text}>Medication Tracker</Text>
    </SafeAreaView>
  );
}

export default App;
