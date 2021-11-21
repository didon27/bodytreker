import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  block: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  partnerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
});
