import {colors} from 'colors';
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
  titleInput: {
    backgroundColor: '#f4f4f4',
    marginTop: 8,
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 2
  },
  descriptionInput: {
    backgroundColor: '#f4f4f4',
    minHeight: 160,
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    marginTop: 8
  },
  addPhotoBlock: {
    height: 90,
    width: 120,
    borderRadius: 14,
  },
  fakeText: {
    fontSize: 17,
    fontWeight: '400',
    color: 'transparent',
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
  addPhoto: {
    height: '100%',
    borderRadius: 10,
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBtn: {
    backgroundColor: colors.mainBlue,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: null,
    marginTop: 0,
    borderRadius: 8,
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
  messageAddCategories: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  removeImage: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    width: 24,
    height: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignItems: 'flex-end',
    borderRadius: 14,
    justifyContent: 'flex-end',
    height: 90,
    width: 120,
    marginRight: 10,
  },
});