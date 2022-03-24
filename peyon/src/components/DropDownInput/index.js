import { colors } from 'colors';
import { Text, View } from 'components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, FlatList } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const DropDownInput = ({ setSearch, search, data, onPress, placeholder, renderItem, showAlways }) => {
    const keyExtractor = useCallback((item, index) => index.toString(), []);
    const [onFocus, setOnFocus] = useState(false);
    const textInputReference = useRef();

    const selectItemList = (item) => {
        onPress(item);
        setOnFocus(false);
        textInputReference.current.blur();
    }

    useEffect(() => {
        let backhandler = BackHandler.addEventListener(
            'hardwareBackPress',
            function () {
                if (textInputReference.current.isFocused()) {
                    textInputReference.current.blur();

                    setOnFocus(true)
                }
                setOnFocus(false)
            },
        );
        return () => {
            backhandler.remove();
        };
    }, []);


    const Item = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => selectItemList(item)} key={index} style={{ paddingHorizontal: 16, height: 36, justifyContent: 'center' }}>
                <Text numberOfLines={1}>{item.description}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <TextInput
                ref={textInputReference}
                onFocus={() => setOnFocus(true)}
                onBlur={() => setOnFocus(false)}
                value={search}
                onChangeText={setSearch}
                placeholder={placeholder}
                style={{ fontSize: 16, borderBottomWidth: 1, borderBottomColor: onFocus ? colors.mainBlue : 'grey', height: 36, paddingHorizontal: 8 }}
            />
            {onFocus && (search.length || showAlways) ?
                <Shadow sides={['bottom', 'left', 'right']} viewStyle={{ backgroundColor: 'white', width: '100%', zIndex: 9999, borderBottomRightRadius: 14, borderBottomLeftRadius: 15, position: 'absolute' }} distance={18} startColor={'#00000012'} finalColor={'transparent'}>
                    <FlatList
                        ListEmptyComponent={<View flex style={{ alignItems: 'center', justifyContent: 'center', height: 40 }}><Text>Not results</Text></View>}
                        style={{ minHeight: 40, maxHeight: 200 }}
                        data={data}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem ? renderItem : Item}
                    />
                </Shadow>
                : null
            }
        </View>
    );
};

export default DropDownInput;
