import { Platform, StyleSheet } from 'react-native';

import Colors from '@components/Colors';

const styles = StyleSheet.create({
  fieldError: {
    color: Colors.errorColor,
  },
  fieldLabel: {
    color: Colors.secondaryColor,
    fontSize: 18,
  },
  fieldWrapper: {
    rowGap: 8,
  },
  inputField: {
    borderRadius: 10,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        padding: 10,
      },
      android: {
        paddingVertical: 7.5,
        paddingHorizontal: 10,
      },
    }),
    fontSize: 16,
  },
});

export default styles;
