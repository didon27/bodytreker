import { colors } from 'colors';
import { CustomSafeAreaView, Text, View } from 'components';
import { API_URL } from 'constants';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import { LocalizationContext } from 'services';
import { mamaAxios } from 'services/api';

const Information = (props) => {
    const { translations } = useContext(LocalizationContext)
    const [information, setInformation] = useState('');

    useEffect(() => {
        mamaAxios.get(API_URL + '/user/get-information').then((response) => setInformation(response.data.text))
    }, [])

    return (
        <View flex style={{ backgroundColor: colors.white }}>
            <CustomSafeAreaView style={{ paddingHorizontal: 16 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ position: 'absolute', left: 0 }}>
                        <Icon name="angle-left" size={30} color={'#585858'} />
                    </TouchableOpacity>
                    <Text bold size={18}>{translations.information}</Text>
                </View>
            </CustomSafeAreaView>
            <WebView
                style={{ marginTop: 24, marginHorizontal: 16 }}
                originWhitelist={['*']}
                source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${information}</body></html>` }}
            />
        </View>
    )
}

export default Information;