import { CustomSafeAreaView, View } from 'components';
import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchInput = ({ onChangeText, value, placeholder }) => {
    return (
        <View row flex centered style={{ backgroundColor: '#f4f4f4', height: 40, borderRadius: 14, paddingHorizontal: 8, }}>
            <Icon name="search-outline" size={20} color={'grey'} />
            <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} style={{ flex: 1, marginRight: 10, paddingLeft: 12, fontSize: 16 }} />

            {value.length ? <TouchableOpacity onPress={() => onChangeText('')}>
                <Icon name="ios-close-circle-outline" size={20} color={'grey'} />
            </TouchableOpacity> : null}
        </View>
    );
};

export default SearchInput;
