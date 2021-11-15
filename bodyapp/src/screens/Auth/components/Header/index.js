import React from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const Header = props => {
  return (
    <SafeAreaView style={{position: 'absolute', zIndex: 9999}}>
      <TouchableOpacity
        style={{marginLeft: 20, width: 40, height: 40}}
        onPress={() => props.navigation.goBack()}>
        <Icon name={'chevron-thin-left'} size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Header;
