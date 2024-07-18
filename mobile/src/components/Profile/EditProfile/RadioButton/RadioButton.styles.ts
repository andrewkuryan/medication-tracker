import { StyleSheet } from 'react-native';

import Colors from '@components/Colors';

const styles = StyleSheet.create({
  checkmark: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  checkmarkWrapper: {
    alignItems: 'center',
    borderColor: Colors.placeholderColor,
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  label: {
    fontSize: 18,
  },
  radioButtonRoot: {
    alignItems: 'center',
    columnGap: 8,
    flexDirection: 'row',
  },
});

export default styles;
