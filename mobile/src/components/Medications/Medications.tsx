import React, { FunctionComponent, useCallback, useEffect } from 'react';
import {
  SafeAreaView, TouchableOpacity, SectionList, Text, View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/ReduxStore';
import {
  decrementCount, fetchAll, incrementCount, MedicationState,
} from '@store/medication/reducer';
// eslint-disable-next-line import/no-cycle
import { MedicationsScreenProps } from '@components/Router.tsx';
import Colors from '@components/Colors';
import PlusIcon from '@icons/plus.svg';
import MedicationItem from './MedicationItem/MedicationItem';

import Styles from './Medications.styles';

function groupMedications(medications: MedicationState['medications']) {
  const medicationValues = Object.values(medications);
  const active = medicationValues.filter((it) => it.data.count < it.data.destinationCount);
  const fulfilled = medicationValues.filter((it) => it.data.count === it.data.destinationCount);
  return [
    ...(active.length > 0 ? [{ title: 'Active', data: active }] : []),
    ...(fulfilled.length > 0 ? [{ title: 'Fulfilled', data: fulfilled }] : []),
  ];
}

const ItemSeparator = () => <View style={Styles.itemSeparator} />;
const SectionHeader = ({ title }: { title: string }) => <Text style={Styles.sectionTitle}>
    {title}
</Text>;
const ListPlaceholder = () => <Text style={Styles.listPlaceholderText}>No medications found</Text>;

const Medications: FunctionComponent<MedicationsScreenProps<'Medications'>> = ({ navigation }) => {
  const dispatch = useDispatch();

  const medications = useSelector<AppState, MedicationState['medications']>((state) => state.medication.medications);
  const isFetching = useSelector<AppState, boolean>((state) => state.service.isFetching);

  const handleAddPress = () => {
    navigation.navigate('AddEditMedication', {});
  };

  const handleItemPress = useCallback((id: number) => {
    navigation.navigate('AddEditMedication', { id });
  }, []);

  const handleIncItem = useCallback((id: number) => {
    dispatch(incrementCount({ id }));
  }, []);

  const handleDecItem = useCallback((id: number) => {
    dispatch(decrementCount({ id }));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchAll());
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <SafeAreaView style={Styles.medicationsRoot}>
        <SectionList
            ItemSeparatorComponent={ItemSeparator}
            SectionSeparatorComponent={ItemSeparator}
            contentContainerStyle={Styles.medicationsList}
            sections={groupMedications(medications)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MedicationItem
                medication={item}
                onPress={handleItemPress}
                onIncCount={handleIncItem}
                onDecCount={handleDecItem}
            />}
            renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
            stickySectionHeadersEnabled
            ListEmptyComponent={ListPlaceholder}
            onRefresh={handleRefresh}
            refreshing={isFetching}
        />
        <TouchableOpacity style={Styles.floatingButton} onPress={handleAddPress}>
            <PlusIcon width={35} height={35} stroke={Colors.secondaryColor}/>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Medications;
