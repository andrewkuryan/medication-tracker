import React, { FunctionComponent, useEffect } from 'react';
import {
  SafeAreaView, TouchableOpacity, SectionList, Text, View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/ReduxStore';
import { fetchAll, MedicationState } from '@store/medication/reducer';
// eslint-disable-next-line import/no-cycle
import { MedicationsScreenProps } from '@components/Router.tsx';
import Colors from '@components/Colors';
import PlusIcon from '@icons/plus.svg';
import MedicationItem from './MedicationItem/MedicationItem';

import Styles from './Medications.styles';

function groupMedications(medications: MedicationState['medications']) {
  const medicationValues = Object.values(medications);
  return [
    {
      title: 'Active',
      data: medicationValues.filter((it) => it.data.count < it.data.destinationCount),
    },
    {
      title: 'Fulfilled',
      data: medicationValues.filter((it) => it.data.count === it.data.destinationCount),
    },
  ];
}

const ItemSeparator = () => <View style={Styles.itemSeparator} />;
const SectionHeader = ({ title }: { title: string }) => <Text style={Styles.sectionTitle}>
    {title}
</Text>;

const Medications: FunctionComponent<MedicationsScreenProps<'Medications'>> = ({ navigation }) => {
  const dispatch = useDispatch();

  const medications = useSelector<AppState, MedicationState['medications']>((state) => state.medication.medications);

  useEffect(() => {
    dispatch(fetchAll());
  }, []);

  const handleAddPress = () => {
    navigation.navigate('AddEditMedication', {});
  };

  const handleItemPress = (id: number) => {
    navigation.navigate('AddEditMedication', { id });
  };

  return (
    <SafeAreaView style={Styles.medicationsRoot}>
        <SectionList
            ItemSeparatorComponent={() => <ItemSeparator />}
            SectionSeparatorComponent={() => <ItemSeparator />}
            contentContainerStyle={Styles.medicationsList}
            sections={groupMedications(medications)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MedicationItem medication={item} onPress={handleItemPress}/>}
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
