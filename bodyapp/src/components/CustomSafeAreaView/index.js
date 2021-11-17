import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {View} from 'components';

const CustomSafeAreaView = ({children, style}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        style && style,
        {
          zIndex: 9999,
          paddingTop: insets.top,
        },
      ]}>
      {children}
    </View>
  );
};

export default CustomSafeAreaView;
