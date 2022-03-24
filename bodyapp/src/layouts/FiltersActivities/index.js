import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList, ScrollView, TouchableOpacity, TextInput, PermissionsAndroid,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';


import { colors } from 'colors';
import { Button, CustomSafeAreaView, SearchInput, Text, View } from 'components';
import { DEVICE_WIDTH } from 'constants';
import { GOOGLE_KEY } from 'constants';


import styles from './styles';
import { useSelector } from 'react-redux';
const radius = 25;

const FiltersActivities = ({ translations, appLanguage, filterModalVisible, setFilters, setFilterModalVisible }) => {
    const [searchPlace, setSearchPlace] = useState('');
    const [places, setPlaces] = useState([]);
    const [currentPlace, setCurrentPlace] = useState(null);
    const insets = useSafeAreaInsets();
    const [distance, setDistance] = useState([radius])
    const [location, setLocation] = useState(null);
    const [locationHideModal, setLocationHideModal] = useState(false);
    const [usesFilters, setUsesFilters] = useState(0);
    const [currentLongitude, setCurrentLongitude] = useState(null)
    const [currentLatitude, setCurrentLatitude] = useState(null)
    const [locationStatus, setLocationStatus] = useState('');
    const [searchCtegory, setSearchCategory] = useState('');
    const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const keyExtractorPlaces = useCallback(item => item.place_id.toString(), []);
    const {
        activities_categories,
      } = useSelector(state => state.activities);

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                getOneTimeLocation();
                subscribeLocationLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //To Check, If Permission is granted
                        getOneTimeLocation();
                        subscribeLocationLocation();
                    } else {
                        setLocationStatus('Permission Denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        };
        requestLocationPermission();
        return () => {
            Geolocation.clearWatch(watchID);
        };
    }, []);

    const getOneTimeLocation = () => {
        setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                setLocationStatus('You are Here');

                //getting the Longitude from the location json
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);

                //getting the Latitude from the location json
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);

                //Setting Longitude state
                setCurrentLongitude(currentLongitude);

                //Setting Longitude state
                setCurrentLatitude(currentLatitude);
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
            (position) => {
                //Will give you the location on location change

                setLocationStatus('You are Here');
                console.log(position);

                //getting the Longitude from the location json        
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);

                //getting the Latitude from the location json
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);

                //Setting Longitude state
                setCurrentLongitude(currentLongitude);

                //Setting Latitude state
                setCurrentLatitude(currentLatitude);
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 1000
            },
        );
    };

    const getMyLocation = () => {
        axios({
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLatitude},${currentLongitude}&key=${GOOGLE_KEY}&result_type=locality`,
            headers: { 'Accept-Language': appLanguage === 'ua' ? 'uk' : appLanguage }
        }).then(response => {
            setLocation({ lat: currentLatitude, lng: currentLongitude });
            setCurrentPlace({ description: response.data.results[0].formatted_address })
            setLocationHideModal(false);
        })
    }

    useEffect(() => {
        if (searchPlace) {
            axios({
                method: 'get',
                url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${translations.ukraine},${searchPlace}&types=(cities)&key=${GOOGLE_KEY}`,
                headers: { 'Accept-Language': appLanguage === 'ua' ? 'uk' : appLanguage }
            })
                .then((response) => { setPlaces(response.data.predictions) })
        }
    }, [appLanguage, searchPlace])

    const getLocation = (place_id) => {
        axios({
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${GOOGLE_KEY}`,
            headers: { 'Accept-Language': appLanguage === 'ua' ? 'uk' : appLanguage }
        }).then(response => setLocation(response.data.results[0].geometry.location))

    }

    useEffect(() => {
        let filters = {};

        if (location) {
            filters.location = location;
        }

        if (distance[0] !== radius) {
            filters.distance = distance;
        }

        if (currentCategory) {
            filters.categoryId = currentCategory.id;
        }

        setUsesFilters(Object.keys(filters).length);

    }, [location, distance, currentCategory])

    const selectPlace = (item) => {
        getLocation(item.place_id);
        setCurrentPlace(item);
        setLocationHideModal(false)
    }

    const useFilters = async () => {
        let filters = { distance };

        if (location) {
            filters.lat = location.lat;
            filters.lng = location.lng;
        }

        if (currentCategory) {
            filters.categoryId = currentCategory.id;
        }

        setFilters(filters);
        setFilterModalVisible(false);
    }

    const clearFilters = () => {
        setLocation(null);
        setCurrentPlace(null);
        setDistance([radius]);
        setCurrentCategory(null);
        setPlaces([]);
        setSearchPlace('');
    }

    const renderItemPlace = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ marginHorizontal: 16, borderBottomWidth: 1, paddingVertical: 16, borderColor: colors.lightGrey }} onPress={() => selectPlace(item)}>
                <Text color={'grey'}>{item.description}</Text>
            </TouchableOpacity>
        )
    }

    const renderCategory = ({ item, index }) => {
        return (
            <TouchableOpacity
                // disabled={
                //     currentCategories.length >= 3 &&
                //     !currentCategories.includes(item.id)
                // }
                onPress={() => { setCurrentCategory(item); setCategoriesModalVisible(false) }}
                key={index}
                style={{
                    ...styles.categoryContainer,
                    borderColor: '#EDF1F7',
                }}>
                <View
                    style={{
                        ...styles.categoryBlock,
                        backgroundColor: item.color,
                        borderColor: colors.blackLabel,
                    }}>
                    <Text style={styles.fakeText}>{item.title}</Text>
                </View>
                <View row centered >
                    <Text
                        style={{
                            ...styles.categoryText,
                            color: item.color,
                        }}>
                        {item.title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Modal isVisible={filterModalVisible} style={{ margin: 0 }} backdropColor={'transparent'}>
            <View style={{ backgroundColor: colors.white, flex: 1 }}>
                <ScrollView bounces={false}>
                    <CustomSafeAreaView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'space-between', paddingHorizontal: 16 }}>
                        <TouchableOpacity style={{ position: 'absolute', bottom: -10, left: 16 }} onPress={() => setFilterModalVisible(false)}>
                            <Icon name="close-outline" size={36} />
                        </TouchableOpacity>
                        <Text size={20} medium>{translations.filters}</Text>
                        <TouchableOpacity disabled={usesFilters <= 0} style={{ position: 'absolute', bottom: 0, right: 16 }} onPress={clearFilters} >
                            <Text medium color={usesFilters <= 0 ? 'grey' : colors.mainBlue}>{translations.clear}</Text>
                        </TouchableOpacity>
                    </CustomSafeAreaView>
                    <View style={{ paddingHorizontal: 16 }}>
                        <Text mTop={40} size={16} color={'grey'}>{translations.location}</Text>
                        <TouchableOpacity onPress={() => setLocationHideModal(true)} style={{ marginTop: 12, borderWidth: 1, borderColor: colors.lightGrey, borderRadius: 14, height: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 16 }}>
                            <Text color={currentPlace?.description ? 'black' : 'grey'} numberOfLines={1}>{currentPlace?.description ? currentPlace?.description : translations.location}</Text>
                            <Icon name="location-outline" size={20} color={'grey'} />
                        </TouchableOpacity>
                        <View mTop={24} mBottom={4} row centered sBetween>
                            <Text size={16} color={'grey'}>{translations.inRadius}</Text>
                            <Text size={16} medium>{distance} кm.</Text>
                        </View>
                        <MultiSlider
                            trackStyle={{ height: 2 }}
                            selectedStyle={{ backgroundColor: colors.mainBlue }}
                            markerStyle={{ borderWidth: 2, borderColor: colors.mainBlue, shadowColor: 'transparent', width: 30, height: 30 }}
                            values={distance}
                            min={0}
                            max={600}
                            step={5}
                            sliderLength={DEVICE_WIDTH - 32}
                            onValuesChange={setDistance}
                        />
                        <View row sBetween centered>
                            <Text mTop={10} size={16} color={'grey'}>{translations.categories}</Text>
                            {currentCategory &&
                                <TouchableOpacity onPress={() => setCurrentCategory(null)}>
                                    <Text size={16} medium color={colors.mainBlue}>Сбросить</Text>
                                </TouchableOpacity>
                            }
                        </View>

                        {currentCategory ?
                            <TouchableOpacity
                                onPress={() => setCategoriesModalVisible(true)}
                                style={{
                                    height: 36,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    paddingHorizontal: 10,
                                    marginTop: 12,
                                    borderColor: '#EDF1F7',
                                }}>
                                <View
                                    style={{
                                        ...styles.categoryBlock,
                                        paddingHorizontal: 10,
                                        backgroundColor: currentCategory.color,
                                        borderColor: colors.blackLabel,
                                    }}>
                                    <Text style={styles.fakeText}>{currentCategory.title}</Text>
                                </View>
                                <View row centered >
                                    <Text
                                        style={{
                                            ...styles.categoryText,
                                            color: currentCategory.color,
                                        }}>
                                        {currentCategory.title}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => setCategoriesModalVisible(true)} style={{ marginTop: 12, borderWidth: 1, borderColor: colors.lightGrey, borderRadius: 14, height: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 16 }}>
                                <Text color={currentPlace?.description ? 'black' : 'grey'}>{currentPlace?.description ? currentPlace?.description : translations.search}</Text>
                                <Icon name="search-outline" size={20} color={'grey'} />
                            </TouchableOpacity>}
                    </View>
                </ScrollView>
                <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom || 16 }}>
                    <Button text={`${translations.apply}${usesFilters > 0 ? ' (' + usesFilters + ')' : ''}`} onPress={useFilters} />
                </View>
            </View>
            <Modal isVisible={locationHideModal} style={{ margin: 0 }} >
                <View style={{ backgroundColor: colors.white, flex: 1 }}>
                    <CustomSafeAreaView style={{ flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.lightGrey, paddingBottom: 16 }}>
                        <SearchInput onChangeText={setSearchPlace} value={searchPlace} placeholder={translations.enterCityName} />
                        <TouchableOpacity onPress={() => setLocationHideModal(false)} style={{ marginLeft: 16 }}>
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
            <Modal isVisible={categoriesModalVisible} style={{ margin: 0 }} >
                <View style={{ backgroundColor: colors.white, flex: 1 }}>
                    <CustomSafeAreaView style={{ flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.lightGrey, paddingBottom: 16 }}>
                        <SearchInput onChangeText={setSearchCategory} value={searchCtegory} placeholder={translations.enterCityName} />
                        <TouchableOpacity onPress={() => setCategoriesModalVisible(false)} style={{ marginLeft: 16 }}>
                            <Text color={colors.mainBlue} medium>{translations.cancel}</Text>
                        </TouchableOpacity>
                    </CustomSafeAreaView>
                    <FlatList
                        data={activities_categories.filter(el => el.title.includes(searchCtegory))}
                        renderItem={renderCategory}

                    />
                </View>
            </Modal>
        </Modal>
    )
}

export default FiltersActivities;