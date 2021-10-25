import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateArrayItem = (array, item, key = 'id', push = false) => {
  const result = [...array];
  const index = result.findIndex((i) => i[key] === item[key]);
  if (index !== -1) {
    result[index] = {...result[index], ...item};
  } else if (push && item[key]) {
    result.push(item);
  }
  return result;
};

export const storage = {
  get(key) {
    return AsyncStorage.getItem(key).then((value) => JSON.parse(value));
  },
  save(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  },
  delete(key) {
    return AsyncStorage.removeItem(key);
  },
  clear() {
    return AsyncStorage.clear();
  },

  update(key, value) {
    return storage.get(key).then((items) => {
      value = updateArrayItem(items, value);
      return AsyncStorage.setItem(key, JSON.stringify(value));
    });
  },
  push(key, value) {
    return storage.get(key).then((items) => {
      if (items === null) {
        return storage.save(key, [value])
          .then(() => [value]);
      }
      if (Array.isArray(items)) {
        const result = updateArrayItem(items, value, 'id', true);
        return storage.save(key, result).then(() => result);
      }
      throw new Error('Save item error!');
    });
  }
};
