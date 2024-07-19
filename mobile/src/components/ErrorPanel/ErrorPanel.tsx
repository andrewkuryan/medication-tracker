import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from '@store/ReduxStore.ts';
import { resetError } from '@store/service/reducer';
import Colors from '@components/Colors.ts';
import CloseIcon from '@icons/close.svg';

import Styles from './ErrorPanel.styles';

const ErrorPanel: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const serviceError = useSelector<AppState, string | null>((state) => state.service.error);

  const handleClosePress = () => {
    dispatch(resetError());
  };

  return serviceError ? (
    <View style={Styles.errorPanelRoot}>
        <Text style={Styles.errorText}>
            {serviceError}
        </Text>
        <TouchableOpacity onPress={handleClosePress}>
            <CloseIcon width={16} height={16} stroke={Colors.white} />
        </TouchableOpacity>
    </View>
  ) : null;
};

export default ErrorPanel;
