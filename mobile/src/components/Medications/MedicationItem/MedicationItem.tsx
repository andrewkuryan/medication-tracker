import React, { FunctionComponent, memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Medication } from '@common/models/shared/Medication';
import Colors from '@components/Colors';
import PlusIcon from '@icons/plus.svg';
import MinusIcon from '@icons/minus.svg';

import Styles from './MedicationItem.styles';

interface MedicationItemProps {
    medication: Medication;
    onPress: (id: number) => void;
    onIncCount: (id: number) => void;
    onDecCount: (id: number) => void;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatProgress(value: number) {
  return `${Math.round(value * 100)}%`;
}

const iconSize = 26;

const MedicationItem: FunctionComponent<MedicationItemProps> = ({
  medication, onPress, onIncCount, onDecCount,
}) => {
  const isFulfilled = medication.data.count === medication.data.destinationCount;

  const handlePress = () => {
    onPress(medication.id);
  };

  const handleIncPress = () => {
    onIncCount(medication.id);
  };

  const handleDecPress = () => {
    onDecCount(medication.id);
  };

  return (
    <TouchableOpacity
        style={[Styles.itemRoot, ...(isFulfilled ? [Styles.fulfilled] : [])]}
        onPress={handlePress}
    >
        <View style={Styles.contentBlock}>
            <View style={Styles.infoBlock}>
                <Text style={Styles.nameText}>{medication.data.name}</Text>
                <View style={Styles.endDateWrapper}>
                    {isFulfilled ? <Text style={Styles.endDateTitle}/> : <>
                        <Text style={Styles.endDateTitle}>Expected End:</Text>
                        <Text style={Styles.endDateValue}>
                            {formatDate(medication.data.endDate)}
                        </Text>
                    </>}
                </View>
            </View>
            <View style={Styles.buttonsBlock}>
                {medication.data.count > 0 ? <TouchableOpacity onPress={handleDecPress}>
                    <MinusIcon width={iconSize} height={iconSize} stroke={Colors.secondaryColor}/>
                </TouchableOpacity> : <View style={{ width: iconSize }}/>}
                <Text style={Styles.countText}>
                    {medication.data.count} / {medication.data.destinationCount}
                </Text>
                {!isFulfilled ? <TouchableOpacity onPress={handleIncPress}>
                    <PlusIcon width={iconSize} height={iconSize} stroke={Colors.secondaryColor}/>
                </TouchableOpacity> : <View style={{ width: iconSize }}/>}
            </View>
        </View>
        <View style={Styles.progressBlock}>
            <Text style={Styles.progressText}>
                {formatProgress(medication.data.count / medication.data.destinationCount)}
            </Text>
            <View style={Styles.progressWrapper}>
                <View style={[
                  Styles.progressBar,
                  { flex: medication.data.count / medication.data.destinationCount },
                ]}/>
            </View>
        </View>
    </TouchableOpacity>
  );
};

export default memo(MedicationItem);
