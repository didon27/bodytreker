import {StyleSheet} from 'react-native';

import {colors} from 'colors';

export default StyleSheet.create({
  container: {justifyContent: 'space-between', flex: 1},
  textBlock: {
    position: 'absolute',
    bottom: 220,
    zIndex: 999,
    width: '100%',
    paddingHorizontal: 16,
  },
  dimmer: {
    width: '100%',
    height: '100%',
    opacity: 0.36,
    zIndex: 2,
    backgroundColor: 'black',
    position: 'absolute',
  },
  backgroundImage: {flex: 1, width: '100%', marginBottom: -20},
  title: {fontSize: 34, color: colors.white, fontWeight: '700'},
  subtitle: {
    color: '#d3d3d3',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  bottomBlock: {
    backgroundColor: '#202124',
    height: 200,
    width: '100%',
    alignItems: 'center',
    zIndex: 9999,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  registerBtn: {
    width: '100%',
    backgroundColor: colors.white,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#9e9e9e',
    height: 56,
    borderRadius: 14,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
