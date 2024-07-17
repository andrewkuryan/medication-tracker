import { StyleSheet } from 'react-native';

import Colors from '@components/Colors';

const styles = StyleSheet.create({
  buttonsBlock: {
    alignItems: 'center',
    columnGap: 8,
    flexDirection: 'row',
  },
  contentBlock: {
    flex: 1,
    flexDirection: 'row',
  },
  countText: {
    fontSize: 18,
  },
  endDateTitle: {
    fontSize: 14,
  },
  endDateValue: {
    color: Colors.secondaryColor,
    fontSize: 14,
  },
  endDateWrapper: {
    columnGap: 6,
    flexDirection: 'row',
  },
  fulfilled: {
    backgroundColor: Colors.placeholderColor,
  },
  infoBlock: {
    flex: 1,
    rowGap: 16,
  },
  itemRoot: {
    backgroundColor: Colors.backgroundColor,
    padding: 12,
    rowGap: 7,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nameText: {
    fontSize: 22,
  },
  progressBar: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 3,
  },
  progressBlock: {
    alignItems: 'center',
    columnGap: 6,
    flexDirection: 'row',
  },
  progressText: {
    fontSize: 12,
  },
  progressWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: 6,
  },
});

export default styles;
