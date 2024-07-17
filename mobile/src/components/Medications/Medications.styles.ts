import { StyleSheet } from 'react-native';

import Colors from '@components/Colors';

const styles = StyleSheet.create({
  floatingButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentColor,
    borderRadius: 30,
    bottom: 35,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 35,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: 60,
  },
  itemSeparator: {
    height: 10,
  },
  medicationsList: {
    padding: 10,
  },
  medicationsRoot: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  sectionTitle: {
    backgroundColor: Colors.backgroundColor,
    fontSize: 22,
    padding: 4,
  },
});

export default styles;
