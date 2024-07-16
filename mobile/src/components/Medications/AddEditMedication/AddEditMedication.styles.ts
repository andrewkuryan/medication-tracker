import { StyleSheet } from 'react-native';

import Colors from '@components/Colors.ts';

const styles = StyleSheet.create({
  addEditRoot: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  datePickerTextPlaceholder: {
    color: Colors.placeholderColor,
  },
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
  formWrapper: {
    padding: 30,
    rowGap: 22,
  },
  frequencyFieldWrapper: {
    flex: 0.5,
  },
  frequencyWrapper: {
    columnGap: 20,
    flexDirection: 'row',
  },
  inputField: {
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentColor,
    justifyContent: 'center',
    marginTop: 16,
    padding: 10,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: Colors.secondaryColor,
    fontSize: 20,
  },
  textInputField: {
    fontSize: 16,
  },
});

export default styles;
