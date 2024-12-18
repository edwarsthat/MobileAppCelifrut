
import React from 'react';
import { View, StyleSheet} from 'react-native';
// import * as Keychain from 'react-native-keychain';
import { lotesType } from '../../../../types/lotesType';
import Camara from './components/Camara';

type propsType = {
    lote: lotesType | undefined
}

export default function FotosCalidad(props:propsType): React.JSX.Element {
    return (
        <View style={styles.container}>
            <Camara lote={props.lote} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation:0,
    },
});
