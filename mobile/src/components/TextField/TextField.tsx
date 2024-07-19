import React, { FunctionComponent } from 'react';
import Animated, {
  interpolateColor, useAnimatedStyle, useDerivedValue, withTiming,
} from 'react-native-reanimated';
import {
  StyleProp, Text, TextInput, View,
} from 'react-native';

import Colors from '@components/Colors.ts';

import Styles from './TextField.styles';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type InputFieldType = 'text' | 'number' | 'password';

interface InputFieldProps {
    value: string;
    onChangeValue: (value: string) => void;
    type?: InputFieldType;
    placeholder?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputStyle?: StyleProp<any>;
}

const InputField: FunctionComponent<InputFieldProps> = ({
  value, onChangeValue, type = 'text', placeholder, inputStyle,
}) => {
  const [isFocused, setFocused] = React.useState(false);
  const focusedValue = useDerivedValue(() => withTiming(isFocused ? 1 : 0));

  const rStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusedValue.value,
      [0, 1],
      [Colors.primaryColor, Colors.accentColor],
    );

    return { borderColor };
  });

  return (
    <AnimatedTextInput
        style={[Styles.inputField, rStyle, ...(inputStyle ? [inputStyle] : [])]}
        value={value}
        onChangeText={onChangeValue}
        keyboardType={type === 'number' ? 'numeric' : 'default'}
        secureTextEntry={type === 'password'}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
    />
  );
};

interface TextFieldProps extends InputFieldProps {
    label?: string;
    required?: boolean;
    errorText?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: StyleProp<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    labelStyle?: StyleProp<any>;
}

const TextField: FunctionComponent<TextFieldProps> = ({
  label,
  required = false,
  errorText,
  style,
  labelStyle,
  ...inputProps
}) => (
  label ? (
    <View style={[Styles.fieldWrapper, ...(style ? [style] : [])]}>
        <Text style={[Styles.fieldLabel, ...(labelStyle ? [labelStyle] : [])]}>
            {`${label}${required ? '*' : ''}`}
        </Text>
        <InputField {...inputProps} />
        {errorText && <Text style={Styles.fieldError}>{errorText}</Text>}
    </View>
  ) : (
    <InputField {...inputProps} />
  )
);

export default TextField;
