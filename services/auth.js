import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@user_data';
const LOGGED_KEY = '@user_logged';

export async function registerUser(username, password) {
  const user = { username, password };
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  return true;
}

export async function loginUser(username, password) {
  const data = await AsyncStorage.getItem(USER_KEY);

  if (!data) return false;

  const savedUser = JSON.parse(data);

  if (
    savedUser.username === username &&
    savedUser.password === password
  ) {
    await AsyncStorage.setItem(LOGGED_KEY, 'true');
    return true;
  }

  return false;
}

export async function isLogged() {
  const logged = await AsyncStorage.getItem(LOGGED_KEY);
  return logged === 'true';
}

export async function logoutUser() {
  await AsyncStorage.removeItem(LOGGED_KEY);
}

export async function getUser() {
  const data = await AsyncStorage.getItem(USER_KEY);
  if (!data) return null;
  return JSON.parse(data);
}
