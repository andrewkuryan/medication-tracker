import React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';

import SRPGenerator from './utils/crypto/srp';
import BackendApi from './api/BackendApi';
import createStore from './store/ReduxStore';
import Login from './components/Login/Login';

import styles from './App.styles';

const srpGenerator = new SRPGenerator(
  BigInt(process.env.SRP_N ?? 0),
  BigInt(process.env.SRP_G ?? 2),
);

const api = new BackendApi(`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);

function App(): React.JSX.Element {
  const store = createStore(api, srpGenerator);

  return (
    <Provider store={store}>
        <SafeAreaView style={styles.appRoot}>
            <Login/>
        </SafeAreaView>
    </Provider>
  );
}

export default App;
