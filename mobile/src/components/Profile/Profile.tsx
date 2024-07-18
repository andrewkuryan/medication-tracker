import React, { FunctionComponent } from 'react';
import {
  SafeAreaView, Text, TouchableOpacity, View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { User } from '@common/models/shared/User';
import { AppDispatch, AppState } from '@store/ReduxStore';
import { logout } from '@store/user/reducer';
// eslint-disable-next-line import/no-cycle
import { ProfileScreenProps } from '@components/Router';

import Styles from './Profile.styles';

function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatBirthDate(date: Date) {
  const ageDiff = Date.now() - date.getTime();
  const age = Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
  return `${formatDate(date)} (${age} yrs.)`;
}

const Profile: FunctionComponent<ProfileScreenProps<'Profile'>> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector<AppState, User | null>((state) => state.user.current);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={Styles.profileRoot}>
        <View style={Styles.profileWrapper}>
            <View style={Styles.infoWrapper}>
                {user?.data.email && <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldName}>Email:</Text>
                    <Text style={Styles.fieldValue}>{user.data.email}</Text>
                </View>}
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldName}>Gender:</Text>
                    <Text style={Styles.fieldValue}>{user?.data.gender ?? 'Not Specified'}</Text>
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldName}>Birth Date:</Text>
                    <Text style={Styles.fieldValue}>{user?.data.birthDate ? formatBirthDate(user.data.birthDate) : 'Not Specified'}</Text>
                </View>
            </View>
            <TouchableOpacity style={Styles.logoutButton} onPress={handleLogout}>
                <Text style={Styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

export default Profile;
