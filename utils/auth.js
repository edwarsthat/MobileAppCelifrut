/* eslint-disable prettier/prettier */

import * as Keychain from 'react-native-keychain';

export const getCredentials = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
        return new Error('Error no hay token de validadcion');
    }
    const { password } = credentials;
    return password;
};
