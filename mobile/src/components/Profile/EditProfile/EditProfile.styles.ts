import { StyleSheet } from 'react-native';

import Colors from '@components/Colors';

const styles = StyleSheet.create({
  datePickerTextPlaceholder: {
    color: Colors.placeholderColor,
  },
  editProfileRoot: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  fieldLabel: {
    color: Colors.secondaryColor,
    fontSize: 18,
  },
  fieldWrapper: {
    rowGap: 8,
  },
  fieldsWrapper: {
    rowGap: 22,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
  },
  inputField: {
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
  },
  radioGroup: {
    rowGap: 6,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentColor,
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
  submitButtonText: {
    color: Colors.secondaryColor,
    fontSize: 20,
  },
  textInputField: {
    fontSize: 16,
  },
});

export default styles;
