import { StyleSheet } from 'react-native';

import Colors from '@components/Colors.ts';

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addEditRoot: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  buttonsWrapper: {
    columnGap: 16,
    flexDirection: 'row',
    marginTop: 16,
  },
  datePickerTextPlaceholder: {
    color: Colors.placeholderColor,
  },
  deleteButton: {
    backgroundColor: Colors.errorColor,
  },
  deleteButtonText: {
    color: Colors.white,
    fontSize: 20,
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
  frequencyFieldLabel: {
    color: Colors.secondaryColor,
    fontSize: 16,
  },
  frequencyFieldWrapper: {
    flex: 0.5,
  },
  frequencyFields: {
    columnGap: 10,
    flexDirection: 'row',
  },
  frequencyWrapper: {
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    rowGap: 12,
  },
  inputField: {
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
  },
  submitButton: {
    backgroundColor: Colors.accentColor,
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
