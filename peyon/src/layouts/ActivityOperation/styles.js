import { colors } from 'colors';
import { StyleSheet } from 'react-native';

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
  categoryText: {
    fontSize: 17,
    fontWeight: '400',
  },
  categoryBlock: {
    opacity: 0.16,
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: -1,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
  },
  fakeText: {
    fontSize: 17,
    fontWeight: '400',
    color: 'transparent',
  },
  categorySearch: {
    backgroundColor: '#f4f4f4',
    marginTop: 8,
    borderRadius: 14,
    fontSize: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  categoryContainer: {
    marginRight: 10,
    height: 38,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  sheet: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    paddingBottom: 16,
    borderColor: colors.lightGrey,
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
  modalControlButton: {
    backgroundColor: colors.white,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14
  },
  deleteButton: { marginTop: 10, width: '100%', height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});