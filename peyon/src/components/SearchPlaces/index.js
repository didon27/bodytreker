import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList, ScrollView, TouchableOpacity, TextInput, PermissionsAndroid,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';


import { colors } from 'colors';
import { Button, CustomSafeAreaView, SearchInput, Text, View } from 'components';
import { DEVICE_WIDTH } from 'constants';
import { GOOGLE_KEY } from 'constants';
import { useSelector } from 'react-redux';


const SearchPlaces = ({ selectPlace, visible, setVisible, translations, appLanguage, placeholder }) => {
    const [searchPlace, setSearchPlace] = useState('');
    const [places, setPlaces] = useState([]);
    const [currentPlace, setCurrentPlace] = useState(null);
    const insets = useSafeAreaInsets();
    const {  userLocation } = useSelector(state => state.user)
    const keyExtractorPlaces = useCallback(item => item.place_id.toString(), []);


    const getMyLocation = () => {
        axios({
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${GOOGLE_KEY}`,
            headers: { 'Accept-Language': appLanguage === 'ua' ? 'uk' : appLanguage }
        }).then(response => {
            selectPlace({ place: response.data.results[0].formatted_address, location: { lat: userLocation.lat, lng: userLocation.lng } })
        })
    }

    useEffect(() => {
        if (searchPlace) {
            axios({
                method: 'get',
                url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${translations.ukraine},${searchPlace}&key=${GOOGLE_KEY}`,
                headers: { 'Accept-Language': appLanguage === 'ua' ? 'uk' : appLanguage }
            })
                .then((response) => { setPlaces(response.data.predictions) })
        }
    }, [appLanguage, searchPlace])

    const getLocation = (item) => {
        axios({
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${item.place_id}&key=${GOOGLE_KEY}`,
            headers: { 'Accept-Language': appLanguage === 'ua' ? 'uk' : appLanguage }
        }).then(response => {
            selectPlace({ place: item.description, location: response.data.results[0].geometry.location })
            // setLocation(response.data.results[0].geometry.location);

        })

    }


    // const selectPlace = (item) => {
    //     getLocation(item.place_id);
    //     setCurrentPlace(item);
    //     setLocationHideModal(false)
    // }

    const renderItemPlace = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={{ marginHorizontal: 16, borderBottomWidth: 1, paddingVertical: 16, borderColor: colors.lightGrey }} onPress={() => getLocation(item)}>
                <Text color={'grey'}>{item.description}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <Modal isVisible={visible} style={{ margin: 0 }} >
            <View style={{ backgroundColor: colors.white, flex: 1 }}>
                <CustomSafeAreaView style={{ flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.lightGrey, paddingBottom: 16 }}>
                    <SearchInput onChangeText={setSearchPlace} value={searchPlace} placeholder={placeholder} />
                    <TouchableOpacity onPress={() => setVisible(false)} style={{ marginLeft: 16 }}>
                        <Text color={colors.mainBlue} medium>{translations.cancel}</Text>
                    </TouchableOpacity>
                </CustomSafeAreaView>
                <FlatList
                    ListHeaderComponent={() => (
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, borderBottomWidth: 1, paddingVertical: 16, borderColor: colors.lightGrey }} onPress={getMyLocation}>
                            <Text color={'grey'}>{translations.myLocation}</Text>
                            <Icon name="location-outline" size={18} color={'grey'} />
                        </TouchableOpacity>
                    )}
                    data={places}
                    renderItem={renderItemPlace}
                    keyExtractor={keyExtractorPlaces}
                />
            </View>
        </Modal>
    );
};

export default SearchPlaces;
