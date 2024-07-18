import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';

import { User } from '@common/models/shared/User';
import { AppDispatch, AppState } from '@store/ReduxStore';
import { ServiceState } from '@store/service/reducer';
import { edit as editUser } from '@store/user/reducer';
import { EditStartPayload } from '@store/user/middleware';
import usePrevious from '@components/hooks/usePrevious';
import { isDefinedObject, parser } from '@components/form/Parser';
// eslint-disable-next-line import/no-cycle
import { ProfileScreenProps } from '@components/Router';
import RadioButton from './RadioButton/RadioButton';

import Styles from './EditProfile.styles';

interface EditForm {
    gender: string | null;
    birthDate: Date | null;
}

const parse = parser<EditStartPayload, EditForm>({
  gender: (value) => value || null,
  birthDate: (value) => value,
});

function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

type GenderKind = 'male' | 'female' | 'other'

function getGenderKind(gender: string | null): GenderKind | null {
  if (gender) {
    switch (gender) {
      case 'Male': return 'male';
      case 'Female': return 'female';
      default: return 'other';
    }
  }
  return null;
}

function getGenderValue(genderKind: GenderKind | null, gender: string | null): string | null {
  switch (genderKind) {
    case 'male': return 'Male';
    case 'female': return 'Female';
    case 'other': return gender;
    default: return null;
  }
}

const EditProfile: FunctionComponent<ProfileScreenProps<'EditProfile'>> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector<AppState, User | null>((state) => state.user.current);
  const serviceState = useSelector<AppState, ServiceState>((state) => state.service);

  const prevIsFetching = usePrevious(serviceState.isFetching);

  const defaultGenderKind = getGenderKind(user?.data.gender ?? null);
  const [genderKind, setGenderKind] = useState(defaultGenderKind);
  const [gender, setGender] = useState(defaultGenderKind === 'other' ? (user?.data.gender ?? '') : '');
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(user?.data.birthDate ?? null);

  const handleSubmit = () => {
    const data = parse({
      gender: getGenderValue(genderKind, gender),
      birthDate,
    });

    if (isDefinedObject(data)) {
      dispatch(editUser(data));
    }
  };

  const handleSelectGender = (type: GenderKind) => {
    setGenderKind(type);
  };

  useEffect(() => {
    if (prevIsFetching === true && !serviceState.isFetching && serviceState.error === null) {
      navigation.navigate('Profile');
    }
  }, [serviceState.isFetching]);

  return (
    <SafeAreaView style={Styles.editProfileRoot}>
        <ScrollView contentContainerStyle={Styles.scrollContainer}>
            <View style={Styles.formWrapper}>
                <View style={Styles.fieldsWrapper}>
                    <View style={Styles.fieldWrapper}>
                        <Text style={Styles.fieldLabel}>Gender</Text>
                        <View style={Styles.radioGroup}>
                            <RadioButton
                                selected={genderKind === 'male'}
                                label="Male"
                                value="male"
                                onSelect={handleSelectGender}
                            />
                            <RadioButton
                                selected={genderKind === 'female'}
                                label="Female"
                                value="female"
                                onSelect={handleSelectGender}
                            />
                            <RadioButton
                                selected={genderKind === 'other'}
                                label="Other"
                                value="other"
                                onSelect={handleSelectGender}
                            />
                        </View>
                        {genderKind === 'other' && <TextInput
                            style={[Styles.inputField, Styles.textInputField]}
                            value={gender}
                            onChangeText={setGender}
                            autoCapitalize="none"
                        />}
                    </View>
                    <View style={Styles.fieldWrapper}>
                        <Text style={Styles.fieldLabel}>Birth Date</Text>
                        <TouchableOpacity
                            style={Styles.inputField}
                            onPress={() => setDatePickerOpen(true)}
                        >
                            <Text
                                style={[
                                  Styles.textInputField,
                                  ...(birthDate == null ? [Styles.datePickerTextPlaceholder] : []),
                                ]}
                            >
                                {birthDate ? formatDate(birthDate) : 'Click to Select'}
                            </Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={isDatePickerOpen}
                            mode="date"
                            title="Select Start Date"
                            date={birthDate ?? new Date()}
                            onConfirm={(date) => {
                              setDatePickerOpen(false);
                              setBirthDate(date);
                            }}
                            onCancel={() => {
                              setDatePickerOpen(false);
                            }}
                        />
                    </View>
                </View>
                <TouchableOpacity style={Styles.submitButton} onPress={handleSubmit}>
                    <Text style={Styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
