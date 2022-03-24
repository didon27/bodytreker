import {colors} from 'colors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  btnBack: {
    padding: 4,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerContainer: {
    height: 90,
    width: '100%',
    zIndex: 9999,
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  secondHeaderBtn: {
    padding: 4,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#f8f8f8',
    borderRadius: 14,
    padding: 20,
  },
});
