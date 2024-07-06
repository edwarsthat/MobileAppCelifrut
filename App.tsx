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
} from 'react-native';

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



export const deviceWidth = createContext<number>(0);

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLogin, setIslogin] = useState<boolean>(false);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [section, setSection] = useState<string>('menu');
  const [anchoDevice, setAnchoDevice] = useState<number>(0);

  useEffect(() => {
    const { width } = Dimensions.get('window');
    setAnchoDevice(width);

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
            <Login
              setPermisos={setPermisos}
              showLoading={showLoading}
              setIslogin={setIslogin} />
            :
            <View style={styles.container}>
              {section !== 'Proceso//Aplicaciones//Lista de empaque' ? <Header seleccionWindow={seleccionWindow} /> : null}
              {section === 'menu' && <Menu permisos={permisos} seleccionWindow={seleccionWindow} />}
              {/* Aplicaciones */}
              {section === 'Proceso//Aplicaciones//Fotos calidad' && <FotosCalidad />}
              {section === 'Proceso//Aplicaciones//Descarte Lavado' && <DescarteLavado />}
              {section === 'Proceso//Aplicaciones//Descarte Encerado' && <DescarteEncerado />}
              {section === 'Proceso//Aplicaciones//Lista de empaque' && <ListaDeEmpaque setSection={setSection} />}

              {/* Historiales aplicaciones */}
              {section === 'Proceso//Historial//Descarte Lavado' && <HistorialDescarteLavadoProceso />}
              {section === 'Proceso//Historial//Descarte Encerado' && <HistorialDescarteEnceradoProceso />}
              {section === 'Proceso//Historial//Fotos calidad' && <HistorialFotosCalidad />}
            </View>
        }

        {section !== 'Proceso//Aplicaciones//Fotos calidad' && section !== 'Proceso//Aplicaciones//Lista de empaque' ?
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
