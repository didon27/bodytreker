import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {View, Text} from 'components';

const ItemCategory = ({changeSelected, item}) => {
  return (
    <TouchableOpacity
      disabled={!changeSelected}
      onPress={() => changeSelected(item.id)}
      style={{
        marginRight: 8,
        height: 26,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 8,
      }}>
      <View
        style={{
          opacity: 0.16,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: -1,
          borderRadius: 12,
          backgroundColor: item?.color,
        }}
      />
      <View row centered>
        <Text
          style={{
            fontWeight: '600',
            color: item.color,
            marginRight: 4,
          }}>
          {item.title}
        </Text>
        {changeSelected && (
          <Icon name="ios-close" size={16} color={item?.color} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ItemCategory);
