import auth from '@react-native-firebase/auth';
import { clearCredentials } from './biometric';

export const logoutUser = async () => {
  try {
    await auth().signOut();
    await clearCredentials();
    return true;
  } catch (error) {
    return false;
  }
};
