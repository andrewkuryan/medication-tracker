import { StyleSheet } from 'react-native';

import Colors from '@components/Colors';

const styles = StyleSheet.create({
  fieldLabel: {
    color: Colors.secondaryColor,
    fontSize: 20,
  },
  fieldWrapper: {
    rowGap: 10,
  },
  inputField: {
    borderColor: Colors.primaryColor,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 18,
    padding: 12,
  },
  loginForm: {
    paddingHorizontal: 40,
    rowGap: 30,
  },
  loginRoot: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentColor,
    justifyContent: 'center',
    marginTop: 20,
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
    fontSize: 22,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 40,
    marginHorizontal: 40,
  },
  tabItem: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  tabItemSelected: {
    borderBottomWidth: 3,
    borderColor: Colors.primaryColor,
  },
  tabText: {
    color: Colors.secondaryColor,
    fontSize: 24,
  },
  tabTextSelected: {
    color: Colors.primaryColor,
  },
});

export default styles;
