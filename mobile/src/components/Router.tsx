import React, { FunctionComponent } from 'react';
import { TouchableOpacity } from 'react-native';
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
// eslint-disable-next-line import/no-cycle
import Profile from '@components/Profile/Profile';
// eslint-disable-next-line import/no-cycle
import EditProfile from '@components/Profile/EditProfile/EditProfile';
import ErrorPanel from '@components/ErrorPanel/ErrorPanel';
import EditIcon from '@icons/edit.svg';
import MedicationIcon from '@icons/medication.svg';
import ProfileIcon from '@icons/profile.svg';
import Colors from '@components/Colors';

import Styles from './Router.styles';

type MedicationsParamList = {
    Medications: undefined;
    AddEditMedication: { id?: number };
}

type ProfileParamList = {
    Profile: undefined;
    EditProfile: undefined;
}

type RootStackParamList = {
    MedicationsTab: NavigatorScreenParams<MedicationsParamList>;
    ProfileTab: NavigatorScreenParams<ProfileParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, T>;

export type MedicationsScreenProps<T extends keyof MedicationsParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MedicationsParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

export type ProfileScreenProps<T extends keyof ProfileParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<ProfileParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

const Tab = createBottomTabNavigator<RootStackParamList>();
const MedicationsStack = createNativeStackNavigator<MedicationsParamList>();
const ProfileStack = createNativeStackNavigator<ProfileParamList>();

const MedicationsScreen: FunctionComponent<RootStackScreenProps<'MedicationsTab'>> = () => (
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
            options={{ title: 'Edit Medication' }}
        />
    </MedicationsStack.Navigator>
);

const EditButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity onPress={onPress}>
        <EditIcon width={24} height={24} stroke={Colors.backgroundColor}/>
    </TouchableOpacity>
);

const ProfileScreen: FunctionComponent<RootStackScreenProps<'ProfileTab'>> = ({ navigation }) => {
  const handleEditPress = () => {
    navigation.navigate('ProfileTab', { screen: 'EditProfile' });
  };

  return (
    <ProfileStack.Navigator screenOptions={{
      headerStyle: Styles.header,
      headerTintColor: Colors.backgroundColor,
    }}>
        <ProfileStack.Screen
            name="Profile"
            component={Profile}
            options={{
              title: 'Your Profile',
              headerRight: () => <EditButton onPress={handleEditPress} />,
            }}
        />
        <ProfileStack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ title: 'Edit Profile' }}
        />
    </ProfileStack.Navigator>
  );
};

const Router: FunctionComponent = () => {
  const user = useSelector<AppState, User | null>((state) => state.user.current);

  return (
    <NavigationContainer>
        {user == null ? (
            <Login/>
        ) : (
            <Tab.Navigator screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: Styles.tabBar,
              tabBarActiveTintColor: Colors.accentColor,
              tabBarInactiveTintColor: Colors.backgroundColor,
              tabBarLabelStyle: Styles.tabBarLabel,
              tabBarIcon: ({ color }) => {
                if (route.name === 'MedicationsTab') {
                  return <MedicationIcon width={22} height={22} stroke={color} />;
                } if (route.name === 'ProfileTab') {
                  return <ProfileIcon width={18} height={18} fill={color} />;
                }
                return <></>;
              },
            })}>
                <Tab.Screen name="MedicationsTab" component={MedicationsScreen} options={{ title: 'Medications' }}/>
                <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }}/>
            </Tab.Navigator>
        )}
        <ErrorPanel />
    </NavigationContainer>
  );
};

export default Router;
