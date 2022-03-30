import React from 'react';
import Modal from 'react-native-modal';
import Text from '../Text';
import View from '../View';
import { colors } from 'colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'components';

const DefaultModal = ({ isVisble, setVisible, onPress, text }) => {

    return (
        <Modal isVisible={isVisble} onBackdropPress={() => setVisible(false)}>
            <View style={{ backgroundColor: colors.white, padding: 16, borderRadius: 10, alignItems: 'center' }}>
                <Icon size={80} color={colors.mainBlue} name="checkmark-circle-outline" />
                <Text size={18} mTop={8} medium>{text}</Text>
                <Button style={{ height: 36 }} text={'OK'} onPress={onPress} />
            </View>
        </Modal>
    );
};

export default DefaultModal;
