import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  shadowHeader: {
    zIndex: 9999,
    backgroundColor: 'white',
    borderBottomColor: '#dddcdc',
    borderBottomWidth: 0.2,
  },
  flatList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  tabBar: {
    backgroundColor: '#f4f4f4',
    height: 36,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    borderRadius: 10,
  },
  headerInput: {
    marginHorizontal: 20,
    backgroundColor: '#f4f4f4',
    height: 46,
    marginBottom: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  activeFilter: {
    backgroundColor: '#4285f4',
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    right: 2,
    top: 16,
  },
  partnerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
});
