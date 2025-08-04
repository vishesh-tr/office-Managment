export const useLocalStoragePromise = () => {
  const getItem = (key: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        const item = localStorage.getItem(key);
        resolve(item ? JSON.parse(item) : null);
      } catch (error) {
        reject(error);
      }
    });
  };

  const setItem = (key: string, value: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const removeItem = (key: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem(key);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  return { getItem, setItem, removeItem };
};
