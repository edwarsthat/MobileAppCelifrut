/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  StyleSheet,
  View,
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





function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLogin, setIslogin] = useState<boolean>(false);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [section, setSection] = useState<string>('menu');

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
            <Header seleccionWindow={seleccionWindow} />
            {section === 'menu' && <Menu permisos={permisos} seleccionWindow={seleccionWindow} />}
            {section === 'Proceso//Aplicaciones//Fotos calidad' && <FotosCalidad />}
            {section === 'Proceso//Aplicaciones//Descarte Lavado' && <DescarteLavado />}
            {section === 'Proceso//Aplicaciones//Descarte Encerado' && <DescarteEncerado />}
            {section === 'Proceso//Historial//Descarte Lavado' && <HistorialDescarteLavadoProceso />}
            {section === 'Proceso//Historial//Descarte Encerado' && <HistorialDescarteEnceradoProceso />}
            {section === 'Proceso//Historial//Fotos calidad' && <HistorialFotosCalidad />}
          </View>
      }

      {section !== 'Proceso//Aplicaciones//Fotos calidad' ?
        <Footer /> : null}

    </SafeAreaView>
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
