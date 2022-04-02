import React, { useContext, useMemo, useRef } from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { colors } from 'colors';
import { Avatar, Button, CustomSafeAreaView, Text, View } from 'components';
import { keys, routeNames } from 'enums';
import { images } from 'images';
import { LocalizationContext } from 'services';
import { DefaultBackDrop } from 'components/BackDrop';
import { storage } from 'services/storage';
import { authActions } from 'store/auth';

import styles from './styles';

const Settings = props => {
  const { appLanguage, translations, setAppLanguage } =
    useContext(LocalizationContext);
  const dispatch = useDispatch();

  const { user } = props.route.params;
  const snapPoints = useMemo(() => ['25%', 216], []);
  const bottomSheetRef = useRef();

  const logout = async () => {
    await storage.delete(keys.JWT_TOKEN);

    dispatch(authActions.removeTokenSuccess());
  };

  const ListButton = props => {
    return (
      <TouchableOpacity onPress={() => props.onPress()} style={styles.btnBlock}>
        <View row centered>
          <MaterialIcon name={props.iconName} size={24} color={'#767676'} />
          <Text size={17} mLeft={10} color={'#131313'} medium>
            {props.text}
          </Text>
        </View>
        <View row centered>
          {props.language && (
            <Text mRight={16} size={17} color={'#9d9d9d'}>
              {returnLanguage()}
            </Text>
          )}
          <Icon name="angle-right" size={26} color={'#9d9d9d'} />
        </View>
      </TouchableOpacity>
    );
  };

  const returnLanguage = () => {
    if (appLanguage === 'en') {
      return 'English';
    } else if (appLanguage === 'ru') {
      return 'Русский';
    } else if (appLanguage === 'ua') {
      return 'Українська';
    }
  };

  const LanguageItem = props => {
    return (
      <TouchableOpacity
        style={{
          ...styles.languageBlock,
          opacity: props.language === appLanguage ? 1 : 0.5,
        }}
        onPress={() => setAppLanguage(props.language)}>
        <View row centered>
          <Image
            source={images[props.language]}
            style={{ width: 30, height: 20 }}
            resizeMode="cover"
          />
          <Text size={16} mLeft={10}>
            {props.title}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.languageCheckbox}
          onPress={() => setAppLanguage(props.language)}>
          {props.language === appLanguage && <View style={styles.check} />}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={DefaultBackDrop}>
        <View style={styles.languageContainer}>
          <Text size={20}>{translations.language}</Text>
        </View>
        <LanguageItem title={'Українська'} language={'ua'} />
        <LanguageItem title={'English'} language={'en'} />
        <LanguageItem title={'Русский'} language={'ru'} />
      </BottomSheetModal>
      <CustomSafeAreaView style={{ paddingHorizontal: 16 }}>
        <View style={{ zIndex: 9999 }}>
          <TouchableOpacity
            style={styles.goBack}
            onPress={() => props.navigation.goBack()}>
            <Icon name="angle-left" size={30} color={'#585858'} />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 20, zIndex: 0 }}>
          <Avatar
            user={user}
            letterStyle={{ fontSize: 36 }}
            style={{ width: 100, height: 100, borderRadius: 50, marginTop: 20 }}
          />
          <Text size={20} mTop={16} medium>
            {user.first_name} {user.last_name}
          </Text>
          <Text color={'#9d9d9d'} size={15}>
            {user.email}
          </Text>
          <Button
            text={translations.edit_profile}
            onPress={() => props.navigation.navigate(routeNames.editProfile)}
            style={styles.editProfile}
          />
        </View>
      </CustomSafeAreaView>
      <View style={styles.titleCategory}>
        <Text color={'#a8a8a8'} size={16} style={{ fontWeight: '600' }}>
          {translations.settings.toLocaleUpperCase()}
        </Text>
      </View>
      <ListButton
        onPress={() => bottomSheetRef.current.present()}
        text={translations.language}
        iconName="language"
        language
      />
      <ListButton
        onPress={() => props.navigation.navigate(routeNames.changePassword)}
        text={translations.change_password}
        iconName="lock"
      />
      <ListButton
        onPress={() => props.navigation.navigate(routeNames.information)}
        text={translations.information}
        iconName="info"
      />
      <TouchableOpacity onPress={logout} style={styles.logout}>
        <Text size={20} mRight={8} color={'#f66'}>
          {translations.logout}
        </Text>
        <MaterialIcon name="logout" size={22} color={'#f66'} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Settings;
