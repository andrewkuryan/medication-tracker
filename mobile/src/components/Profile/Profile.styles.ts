import { StyleSheet } from 'react-native';

import Colors from '@components/Colors';

const styles = StyleSheet.create({
  fieldName: {
    fontSize: 18,
    textAlign: 'left',
  },
  fieldValue: {
    color: Colors.secondaryColor,
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  fieldWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoWrapper: {
    rowGap: 20,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: Colors.errorColor,
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
  logoutButtonText: {
    color: Colors.white,
    fontSize: 20,
  },
  profileRoot: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  profileWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
});

export default styles;
