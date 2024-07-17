import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { CompositeScreenProps, NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { User } from '@common/models/shared/User';
import { AppState } from '@store/ReduxStore';
import Login from '@components/Login/Login';
// eslint-disable-next-line import/no-cycle
import Medications from '@components/Medications/Medications';
// eslint-disable-next-line import/no-cycle
import AddEditMedication from '@components/Medications/AddEditMedication/AddEditMedication';
import Colors from '@components/Colors';

import Styles from './Router.styles';

type MedicationsParamList = {
    Medications: undefined;
    AddEditMedication: { id?: number };
}

type RootStackParamList = {
    MedicationsTab: NavigatorScreenParams<MedicationsParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, T>;

export type MedicationsScreenProps<T extends keyof MedicationsParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MedicationsParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

const Tab = createBottomTabNavigator<RootStackParamList>();
const MedicationsStack = createNativeStackNavigator<MedicationsParamList>();

const MedicationsScreen: FunctionComponent = () => (
    <MedicationsStack.Navigator screenOptions={{
      headerStyle: Styles.header,
      headerTintColor: Colors.backgroundColor,
    }}>
        <MedicationsStack.Screen
            name="Medications"
            component={Medications}
            options={{ title: 'Your Medications' }}
        />
        <MedicationsStack.Screen
            name="AddEditMedication"
            component={AddEditMedication}
            options={{ title: 'Add Medication' }}
        />
    </MedicationsStack.Navigator>
);

const Router: FunctionComponent = () => {
  const user = useSelector<AppState, User | null>((state) => state.user.current);

  return (
    <NavigationContainer>
        {user == null ? (
            <Login/>
        ) : (
            <Tab.Navigator screenOptions={{
              headerShown: false,
              tabBarStyle: Styles.tabBar,
              tabBarActiveTintColor: Colors.accentColor,
              tabBarInactiveTintColor: Colors.backgroundColor,
              tabBarLabelStyle: Styles.tabBarLabel,
            }}>
                <Tab.Screen name="MedicationsTab" component={MedicationsScreen} options={{ title: 'Medications' }} />
            </Tab.Navigator>
        )}
    </NavigationContainer>
  );
};

export default Router;
