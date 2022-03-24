import { colors } from 'colors';
import { CustomSafeAreaView, SearchInput, Text, View } from 'components';
import { API_URL } from 'constants';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { mamaAxios } from 'services/api';

const SearchActivities = ({ data, translations, isVisible, setIsVisible, setSearch, search }) => {
    const keyExtractor = useCallback((item, index) => index.toString(), []);
    const [_search, _setSearch] = useState('');

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => _setSearch(item.title)
                }
                style={{ marginHorizontal: 16, borderBottomWidth: 1, paddingVertical: 16, borderColor: colors.lightGrey }
                } >
                <Text numberOfLines={1} color={'grey'}>{item.title}</Text>
            </TouchableOpacity >
        )
    }

    const listEmpty = () => {
        return (
            <View flex centered jCenter mTop={20}>
                <Text color={'grey'}>Результатов нет</Text>
            </View>
        )
    }

    return (
        <Modal isVisible={isVisible} style={{ margin: 0 }}  backdropColor={'transparent'} >
            <View style={{ backgroundColor: colors.white, flex: 1 }}>
                <CustomSafeAreaView style={{ flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.lightGrey, paddingBottom: 16 }}>
                    <TouchableOpacity onPress={() => {setSearch(''); setIsVisible(true)}}>
                        <Icon name="angle-left" size={30} color="grey" style={{ marginRight: 16 }} />
                    </TouchableOpacity>
                    <SearchInput onChangeText={_setSearch} value={_search} placeholder={translations.enterCityName} />
                    <TouchableOpacity onPress={() => { setSearch(_search); setIsVisible(true) }} style={{ marginLeft: 16 }}>
                        <Text color={colors.mainBlue} medium>{translations.find}</Text>
                    </TouchableOpacity>
                </CustomSafeAreaView>
                <FlatList
                    ListEmptyComponent={listEmpty}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            </View>
        </Modal>
    )
}

export default SearchActivities;