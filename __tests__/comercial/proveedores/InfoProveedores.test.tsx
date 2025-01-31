
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import InfoProveedores from '../../../src/comercial/proveedores/InfoProveedores';
// import renderer from 'react-test-renderer';
// import React from 'react';
// import { render, waitFor } from '@testing-library/react-native';
import mockData from './__mock__/proceso.proveedors.json';
import useEnvContext from '../../../src/hooks/useEnvContext';
import { useAppContext } from '../../../src/hooks/useAppContext';
import { render } from '@testing-library/react-native';
const { Response } = require('node-fetch');
import React from 'react';

// jest.setup.js

jest.mock('react-native-device-info', () => {
    return {
        getUniqueId: jest.fn(() => 'mocked-unique-id'),
        getVersion: jest.fn(() => '1.0.0'),
        getSystemName: jest.fn(() => 'mocked-system-name'),
        // ...whatever else your code calls
    };
});

jest.mock('react-native-fs', () => ({
    mkdir: jest.fn(),
    readFile: jest.fn(),
    // or whatever methods your code references
}));

jest.mock('react-native-vector-icons/FontAwesome', () => 'MockedFontAwesome');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'MockedFontAwesome5');

jest.mock('react-native-vision-camera', () => 'MockedReactNativeVisioCamera');

jest.mock('@react-native-async-storage/async-storage', () =>
    'MockAsyncStorage');

// jest.setup.js
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('../../../src/hooks/useEnvContext', () => jest.fn());
jest.mock('../../../src/hooks/useAppContext', () => ({
    useAppContext: jest.fn(),
}));


jest.mock('../../../utils/auth', () => ({
    getCredentials: jest.fn(async () => 'Bearer test-token'),
}));


console.log(mockData);
// Mock de `fetch`
global.fetch = jest.fn(() =>
    Promise.resolve(
        new Response(
            JSON.stringify({
                status: 200,
                data: mockData,
            })
        )
    )
);



beforeEach(() => {
    jest.clearAllMocks(); // Limpia mocks entre pruebas
    (useEnvContext as jest.Mock).mockReturnValue({ url: 'http://mocked-url.com' });
    (useAppContext as jest.Mock).mockReturnValue({ setLoading: jest.fn() });
});

describe('InfoProveedores Component', () => {

    test("Se renderiza bien el componente", async () => {
        const { getByText } = render(<InfoProveedores />);


        expect(getByText(/Proveedores/i)).toBeTruthy();

    });

    test('Renderiza los 4 proveedores en el FlatList', async () => {
        const { findAllByTestId, getByTestId } = render(<InfoProveedores />);

        const items = await findAllByTestId('tarjeta_proveedor_id');

        expect(items).toHaveLength(4);
        expect(getByTestId("proveedores_buscar_text_input")).toBeVisible();
    });

});

