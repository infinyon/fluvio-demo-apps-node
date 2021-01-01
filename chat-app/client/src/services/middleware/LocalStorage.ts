const StorageName = "Fluvio-Simple-Chat";

export const getLocalStorage = () => {
  return localStorage.getItem(StorageName);
};

export const setLocalStorage = (data: string) => {
  return localStorage.setItem(StorageName, data);
};

export const clearLocalStorage = () => {
  return localStorage.removeItem(StorageName);
};