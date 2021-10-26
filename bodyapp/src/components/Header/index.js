import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from 'colors';
import styles from './styles';
import PropTypes from 'prop-types';

const Header = (props) => {
  return (
    <SafeAreaView style={{height: 100, backgroundColor: colors.white, paddingTop: 10}}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.btnBack}
        >
          <Icon name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        {props.title && (
          <View style={styles.title}>
            <Text style={styles.titleTxt}>{props.title}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object.isRequired
};

Header.defaultProps = {
  title: null
};

export default Header;
