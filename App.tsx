/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Login from './src/login/Login';
import Footer from './src/components/Footer';
import PantallaDeCarga from './src/components/PantallaDeCarga';
import Menu from './src/menu/Menu';
import Header from './src/components/Header';
import DescarteLavado from './src/Proceso/Aplicaciones/descarteLavado/DescarteLavado';
import HistorialDescarteLavadoProceso from './src/Proceso/historial/historialDescarteLavado/HistorialDescarteLavadoProceso';
import DescarteEncerado from './src/Proceso/Aplicaciones/descarteEncerado/DescarteEncerado';
import HistorialDescarteEnceradoProceso from './src/Proceso/historial/historialDescarteEncerado/HistorialDescarteEnceradoProceso';
import FotosCalidad from './src/Proceso/Aplicaciones/FotosCalidad/FotosCalidad';
import HistorialFotosCalidad from './src/Proceso/historial/fotosCalidad/HistorialFotosCalidad';
import ListaDeEmpaque from './src/Proceso/Aplicaciones/listaDeEmpaque/ListaDeEmpaque';
import PrecioLimon from './src/comercial/precios/limon/PrecioLimon';
import PrecioNaranja from './src/comercial/precios/naranja/PrecioNaranja';
import IngresoClasificacionCalidad from './src/calidad/ingresos/Clasificacion descarte/IngresoClasificacionCalidad';
import { CargoType } from './types/cargosType';
import IngresoHigienePersonal from './src/calidad/ingresos/ingresoHigienePersonal/IngresoHigienePersonal';



export const deviceWidth = createContext<number>(0);

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLogin, setIslogin] = useState<boolean>(false);
  const [permisos, setPermisos] = useState<CargoType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [section, setSection] = useState<string>('menu');
  const [anchoDevice, setAnchoDevice] = useState<number>(0);
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    const { width } = Dimensions.get('window');
    setAnchoDevice(width);
    setVersion(DeviceInfo.getVersion());
  }, []);
  const showLoading = (): void => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  const seleccionWindow = (data: string): void => {
    setSection(data);
  };
  const obtenerPermisos = (cargo:CargoType): void => {
    setPermisos(cargo);
  };
  return (
    <deviceWidth.Provider value={anchoDevice}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        {loading ? <PantallaDeCarga />
          :
          !isLogin ?
            <>
              <Text>V-{version}</Text>
              <Login
                obtenerPermisos={obtenerPermisos}
                showLoading={showLoading}
                setIslogin={setIslogin} />
            </>
            :
            <View style={styles.container}>
              {section !== '66b6707777549ed0672a9029' ? <Header seleccionWindow={seleccionWindow} /> : null}
              {section === 'menu' && <Menu permisos={permisos} seleccionWindow={seleccionWindow} />}

              {/* Calidad */}
              {section === "66b6701177549ed0672a9022" && <IngresoClasificacionCalidad />}
              {section === "66c5130bb51eef12da89050e" && <IngresoHigienePersonal />}

              {/* Aplicaciones */}
              {section === '66b6705a77549ed0672a9026' && <FotosCalidad />}
              {section === '66b6706477549ed0672a9027' && <DescarteLavado />}
              {section === '66b6706e77549ed0672a9028' && <DescarteEncerado />}
              {section === '66b6707777549ed0672a9029' && <ListaDeEmpaque setSection={setSection} />}

              {/* Historiales aplicaciones */}
              {section === '66b6708677549ed0672a902a' && <HistorialDescarteLavadoProceso />}
              {section === '66b6708f77549ed0672a902b' && <HistorialDescarteEnceradoProceso />}
              {section === '66b6709877549ed0672a902c' && <HistorialFotosCalidad />}

              {/* comercial */}
              {section === '66b670a777549ed0672a902d' && <PrecioLimon />}
              {section === '66b670b077549ed0672a902e' && <PrecioNaranja />}
            </View>
        }

        {section !== '66b6705a77549ed0672a9026' && section !== '66b6707777549ed0672a9029' ?
          <Footer /> : null}

      </SafeAreaView>
    </deviceWidth.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
  },
});

export default App;
