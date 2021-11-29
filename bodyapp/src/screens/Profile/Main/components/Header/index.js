import React, {Fragment} from 'react';
import {TouchableOpacity} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';

import {colors} from 'colors';
import {View, Text, Button} from 'components';
import {images} from 'images';
import {DEVICE_WIDTH} from 'constants';

import styles from './styles';

function Header({myActivities, translations, setTab, tab, user}) {
  const controlButton = (title, value) => {
    return (
      <TouchableOpacity
        onPress={() => setTab(value)}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 10,
          borderBottomWidth: value === tab ? 2 : 1,
          borderColor: value === tab ? colors.mainBlue : colors.grey,
        }}>
        <Text
          size={16}
          color={value === tab ? colors.mainBlue : colors.grey}
          style={{fontWeight: value === tab ? '600' : '500'}}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Fragment>
      <View>
        <SliderBox
          sliderBoxHeight={360}
          circleLoop
          imageLoadingColor={colors.mainBlue}
          inactiveSlideScale={1}
          paginationBoxVerticalPadding={0}
          enableMomentum
          images={[
            images.startBackground,
            images.startBackground,
            images.startBackground,
          ]}
          dotStyle={{width: 50, height: 4}}
          paginationBoxStyle={{marginBottom: 40}}
          dotColor={colors.mainBlue}
          inactiveDotColor={'white'}
        />
      </View>
      <View style={styles.headerContainer}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}>
          <View row sBetween centered>
            <Text
              size={20}
              style={{fontWeight: '700', width: DEVICE_WIDTH * 0.5}}>
              {user.first_name + ' ' + user.last_name}
            </Text>
            <Button
              onPress={setTab}
              text={translations.edit}
              style={styles.headerBtn}
            />
          </View>
          <Text size={15} style={{fontWeight: '500'}} color={'grey'}>
            @{user.username.toLocaleLowerCase()}
          </Text>
        </View>
        <View row centered sBetween style={styles.counterBlock}>
          <View centered>
            <Text size={22} color={colors.mainBlue} style={{fontWeight: '600'}}>
              {myActivities.length}
            </Text>
            <Text mTop={4} color={'grey'} style={{fontWeight: '500'}}>
              Activities
            </Text>
          </View>

          <View centered>
            <Text size={22} color={colors.mainBlue} style={{fontWeight: '600'}}>
              125K
            </Text>
            <Text mTop={4} color={'grey'} style={{fontWeight: '500'}}>
              Followers
            </Text>
          </View>

          <View centered>
            <Text size={22} color={colors.mainBlue} style={{fontWeight: '600'}}>
              125K
            </Text>
            <Text mTop={4} color={'grey'} size={14} style={{fontWeight: '500'}}>
              Followings
            </Text>
          </View>
        </View>
      </View>
      <View row style={{paddingBottom: 20}}>
        {controlButton('Информация', true)}
        {controlButton('Активити', false)}
      </View>
    </Fragment>
  );
}

export default React.memo(Header);
