import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Styles from './RadioButton.styles';

interface RadioButtonProps<V extends string> {
    selected: boolean;
    label: string;
    value: V;
    onSelect:(value: V) => void;
}

const RadioButton = <V extends string>({
  selected, label, value, onSelect,
}: RadioButtonProps<V>) => {
  const handlePress = () => {
    onSelect(value);
  };

  return (
    <View style={Styles.radioButtonRoot}>
        <TouchableOpacity style={Styles.checkmarkWrapper} onPress={handlePress}>
            {selected && <View style={Styles.checkmark} />}
        </TouchableOpacity>
        <Text style={Styles.label} onPress={handlePress}>{label}</Text>
    </View>
  );
};

export default RadioButton;
