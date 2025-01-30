import { describe, test, expect } from '@jest/globals';
import TarjetaProveedor from '../../../src/comercial/proveedores/components/TarjetaProveedor';
import renderer from 'react-test-renderer';
import React from 'react';
import { render } from '@testing-library/react-native';

describe('TarjetaProveedor Component', () => {
    const mockProveedor = {
        'CODIGO INTERNO': 12345,
        PREDIO: 'Finca La Esperanza',
        ICA: {
            code: 'ICA-6789',
            tipo_fruta: ['Banana', 'Mango'],
            fechaVencimiento: '2025-12-31',
        },
        GGN: {
            code: 'GGN-9876',
            tipo_fruta: ['Banana', 'Papaya'],
            fechaVencimiento: '2026-06-15',
            paises: ['Colombia', 'Ecuador'],
        },
    };

    test('Debe renderizar correctamente con datos válidos', () => {
        const tree = renderer.create(<TarjetaProveedor proveedor={mockProveedor} />).toJSON();
        expect(tree).toMatchSnapshot(); // Compara la UI renderizada con una versión guardada
    });

    test('Debe renderizar correctamente cuando faltan datos', () => {
        const proveedorIncompleto = {
            'CODIGO INTERNO': null,
            PREDIO: '',
            ICA: {},
            GGN: null,
        };
        const tree = renderer.create(<TarjetaProveedor proveedor={proveedorIncompleto} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('Debe renderizar correctamente cuando faltan datos 2', () => {
        const proveedorIncompleto = {
            'CODIGO INTERNO': undefined,
            PREDIO: null,
            ICA: null,
            GGN: {},
        };
        const tree = renderer.create(<TarjetaProveedor proveedor={proveedorIncompleto} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('Debe renderizar el código del proveedor', () => {
        const { getByText } = render(<TarjetaProveedor proveedor={mockProveedor} />);
        expect(getByText(/Codigo 12345/i)).toBeTruthy();
    });

    test('Debe renderizar el predio correctamente', () => {
        const { getByText } = render(<TarjetaProveedor proveedor={mockProveedor} />);
        expect(getByText(/Finca La Esperanza/i)).toBeTruthy();
    });
    test('Debe renderizar los datos de ICA correctamente', () => {
        const { getByText } = render(<TarjetaProveedor proveedor={mockProveedor} />);
        expect(getByText(/ICA-6789/i)).toBeTruthy();
        expect(getByText(/Banana, Mango,/i)).toBeTruthy();
        expect(getByText(/2025-12-31/i)).toBeTruthy();
    });

    // test('Debe renderizar los datos de GGN correctamente', () => {
    //     const { getByText } = render(<TarjetaProveedor proveedor={mockProveedor} />);
    //     expect(getByText(/GGN/i)).toBeTruthy();
    //     expect(getByText(/Código:/i)).toBeTruthy();
    //     expect(getByText(/GGN-9876/i)).toBeTruthy();
    //     expect(getByText(/Tipo de Fruta:/i)).toBeTruthy();
    //     expect(getByText(/Banana, Papaya/i)).toBeTruthy();
    //     expect(getByText(/Vencimiento:/i)).toBeTruthy();
    //     expect(getByText(/2026-06-15/i)).toBeTruthy();
    // });
});
