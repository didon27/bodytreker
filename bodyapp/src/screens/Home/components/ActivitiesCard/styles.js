import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 14,
    paddingRight: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    elevation: 4,
  },
  image: {
    height: 160,
    width: '100%',
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 12,
  },
  avatar: {width: 34, height: 34, borderRadius: 17},
  button: {height: 36, flex: 1, marginTop: 16},
  category: {
    marginRight: 6,
    marginTop: 6,
    paddingHorizontal: 8,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});