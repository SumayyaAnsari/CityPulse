import * as Keychain from 'react-native-keychain';

export async function storeCredentialsBiometric(email, password) {
  try {
    await Keychain.setGenericPassword(email, password, {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET, 
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function getCredentialsBiometric() {
  try {
    const creds = await Keychain.getGenericPassword();
    if (!creds) return null;
    return { email: creds.username, password: creds.password };
  } catch (e) {
    return null;
  }
}

export async function clearCredentials() {
  try {
    await Keychain.resetGenericPassword();
    return true;
  } catch (e) {
    return false;
  }
}
