import { StyleSheet } from 'react-native';

import Colors from '@components/Colors';

const styles = StyleSheet.create({
  errorPanelRoot: {
    alignItems: 'center',
    backgroundColor: Colors.errorColor,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'absolute',
    right: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    top: 30,
  },
  errorText: {
    color: Colors.white,
    fontSize: 18,
  },
});

export default styles;
