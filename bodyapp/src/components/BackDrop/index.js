import React from 'react';

import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';

export const DefaultBackDrop = props => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    enableTouchThrough={true}
  />
);
