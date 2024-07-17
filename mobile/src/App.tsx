import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import createStore from '@store/ReduxStore';
import { fetch as fetchUser } from '@store/user/reducer';
import { setSessionHeaders } from '@store/user/session';
import Router from '@components/Router';
import SRPGenerator from './utils/crypto/srp';
import BackendApi from './api/BackendApi';

const srpGenerator = new SRPGenerator(
  BigInt(process.env.SRP_N ?? 0),
  BigInt(process.env.SRP_G ?? 2),
);

const api = new BackendApi(`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);

function App(): React.JSX.Element {
  const store = createStore(api, srpGenerator);

  useEffect(() => {
    AsyncStorage.getItem('session')
      .then((result) => {
        if (result) {
          const session = JSON.parse(result);
          setSessionHeaders(api, session);
          store.dispatch(fetchUser());
        }
      });
  }, []);

  return (
    <Provider store={store}>
        <Router/>
    </Provider>
  );
}

export default App;
