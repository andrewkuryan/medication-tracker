import React, { FunctionComponent, useEffect } from 'react';
import {
  SafeAreaView, TouchableOpacity, SectionList, Text, View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { Medication } from '@common/models/shared/Medication';
import { AppState } from '@store/ReduxStore';
import { fetchAll } from '@store/medication/reducer';
import Colors from '@components/Colors';
import PlusIcon from '@icons/plus.svg';
import MedicationItem from './MedicationItem/MedicationItem';

import Styles from './Medications.styles';

function groupMedications(medications: Medication[]) {
  return [
    {
      title: 'Active',
      data: medications.filter((it) => it.data.count < it.data.destinationCount),
    },
    {
      title: 'Fulfilled',
      data: medications.filter((it) => it.data.count === it.data.destinationCount),
    },
  ];
}

const ItemSeparator = () => <View style={Styles.itemSeparator} />;
const SectionHeader = ({ title }: { title: string }) => <Text style={Styles.sectionTitle}>
    {title}
</Text>;

const Medications: FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const medications = useSelector<AppState, Medication[]>((state) => state.medication.medications);

  useEffect(() => {
    dispatch(fetchAll());
  }, []);

  const handleAddPress = () => {
    navigation.dispatch(CommonActions.navigate('AddEditMedication'));
  };

  return (
    <SafeAreaView style={Styles.medicationsRoot}>
        <SectionList
            ItemSeparatorComponent={() => <ItemSeparator />}
            SectionSeparatorComponent={() => <ItemSeparator />}
            contentContainerStyle={Styles.medicationsList}
            sections={groupMedications(medications)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MedicationItem medication={item}/>}
            renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
            stickySectionHeadersEnabled
        />
        <TouchableOpacity style={Styles.floatingButton} onPress={handleAddPress}>
            <PlusIcon width={35} height={35} stroke={Colors.secondaryColor}/>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Medications;
