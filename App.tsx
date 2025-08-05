
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
  Alert,
  BackHandler,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Login from './src/login/Login';
import Menu from './src/menu/Menu';
import Header from './src/components/Header';
import DescarteLavado from './src/Proceso/Aplicaciones/descarteLavado/DescarteLavado';
import HistorialDescarteLavadoProceso from './src/Proceso/historial/historialDescarteLavado/HistorialDescarteLavadoProceso';
import DescarteEncerado from './src/Proceso/Aplicaciones/descarteEncerado/DescarteEncerado';
import HistorialDescarteEnceradoProceso from './src/Proceso/historial/historialDescarteEncerado/HistorialDescarteEnceradoProceso';
import FotosCalidad from './src/Proceso/Aplicaciones/FotosCalidad/FotosCalidad';
import HistorialFotosCalidad from './src/Proceso/historial/fotosCalidad/HistorialFotosCalidad';
import ListaDeEmpaque from './src/Proceso/Aplicaciones/listaDeEmpaque/ListaDeEmpaque';
import IngresoClasificacionCalidad from './src/calidad/ingresos/Clasificacion descarte/IngresoClasificacionCalidad';
import { CargoType } from './types/cargosType';
import IngresoHigienePersonal from './src/calidad/ingresos/ingresoHigienePersonal/IngresoHigienePersonal';
import InventarioFrutaSinProcesar from './src/inventarioYlogistica/inventarios/frutaSinProcesar/InventarioFrutaSinProcesar';
import InventarioDesverdizado from './src/inventarioYlogistica/inventarios/frutaDesverdizando/InventarioDesverdizado';
import OrdenVaceo from './src/inventarioYlogistica/inventarios/ordenVaceo/OrdenVaceo';
import IngresarFormularioCalidad from './src/calidad/formularios/ingresarFormulariosCalidad/IngresarFormularioCalidad';
import InventarioyLogistica from './src/menu/InventarioyLogistica';
import LoadingModal from './src/UI/LoadingModal';
import { lotesType } from './types/lotesType';
import Calidad from './src/menu/Calidad';
import IngresosFormulariosCalidad from './src/menu/calidad/IngresosFormulariosCalidad';
import IngresosCalidad from './src/menu/calidad/IngresosCalidad';
import Aplicaciones from './src/menu/proceso/Aplicaciones';
import ProcesoMenu from './src/menu/ProcesoMenu';
import HistorialAplicaciones from './src/menu/proceso/HistorialAplicaciones';
import Inventarios from './src/menu/Invetarios/Inventarios';
import Comercial from './src/menu/Comercial';
import Proveedores from './src/menu/comercial/Proveedores';
import InfoProveedores from './src/comercial/proveedores/InfoProveedores';
import Loader from './src/utils/Loader';
import { useAppStore } from './src/stores/useAppStore';

type envContexttype = {
  url: string,
  socketURL: string
}

// export const envContext = createContext<envContexttype>({
//   url: "https://operativo.celifrut.com",
//   socketURL: "ws://operativo.celifrut.com",
// });

export const envContext = createContext<envContexttype>({
  url: "http://127.0.0.1:3010", // Este valor será sobrescrito por el Provider
  socketURL: "ws://127.0.0.1",
});

export const deviceWidth = createContext<number>(0);
export const stackContext = createContext<string[]>([]);

function App(): React.JSX.Element {
  const loading = useAppStore((state) => state.loading);
  const isDarkMode = useColorScheme() === 'dark';
  const [isLogin, setIslogin] = useState<boolean>(false);
  const [permisos, setPermisos] = useState<CargoType>();
  const [section, setSection] = useState<string>('menu');
  const [anchoDevice, setAnchoDevice] = useState<number>(0);
  const [version, setVersion] = useState<string>('');
  const [stack, setStack] = useState<string[]>(['menu']);

  //estado lote seleccionado para las diferentes aplicaciones
  const [lote, setLote] = useState<lotesType>();

  // Configuración para producción
  // const env = { url: "https://operativo.celifrut.com", socketURL: "ws://operativo.celifrut.com" };

  // Configuración para desarrollo local
  const isEmulator = DeviceInfo.isEmulatorSync();
  const localIP = isEmulator ? '10.0.2.2' : '192.168.20.81'; // Usa tu IP local si estás en dispositivo físico
  const env = {
    url: `http://${localIP}:3010`,
    // socketURL: `ws://${localIP}:3010`,
    socketURL: `http://${localIP}:3010`,
  };

  useEffect(() => {
    const handleBackPress = (): boolean | any => {
      if (stack?.length === 1) {
        Alert.alert('Cerrar sesion', '¿Quieres cerrar sesion?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cerrar', onPress: () => closeSesion() },
        ]);
        return true;
      } else if (stack?.length > 0) {
        const newStack = stack.slice(0, -1);
        const nStacks = newStack.length;

        setStack([...newStack]);
        setSection(newStack[nStacks - 1]);
        return true;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, [stack]);

  useEffect(() => {
    const { width } = Dimensions.get('window');
    setAnchoDevice(width);
    setVersion(DeviceInfo.getVersion());
  }, []);


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  const seleccionWindow = (data: string): void => {
    setStack(prev => [...prev, data]);
    setSection(data);
  };
  const obtenerPermisos = (cargo: CargoType): void => {
    setPermisos(cargo);
  };
  const closeSesion = (): void => {
    setIslogin(false);
    setPermisos(undefined);
  };

  return (
    <envContext.Provider value={env}>
      <stackContext.Provider value={stack} >
        <deviceWidth.Provider value={anchoDevice}>
          <SafeAreaView style={styles.container}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            {
              !isLogin ?
                <>

                  <Text>V-{version}</Text>
                  <Login
                    obtenerPermisos={obtenerPermisos}
                    setIslogin={setIslogin} />
                </>
                :
                <View style={styles.container}>
                  <Loader url={env.url} />

                  {(section !== '66b6707777549ed0672a9029')
                    ? <Header
                      seleccionWindow={seleccionWindow}
                      setLote={setLote}
                      section={section} />
                    : null}
                  {section === 'menu' && <Menu permisos={permisos} seleccionWindow={seleccionWindow} />}
                  {section === 'Inventario y Logística' && <InventarioyLogistica permisos={permisos} seleccionWindow={seleccionWindow} />}
                  {section === 'Proceso' && <ProcesoMenu permisos={permisos} seleccionWindow={seleccionWindow} />}
                  {section === 'Calidad' && <Calidad permisos={permisos} seleccionWindow={seleccionWindow} />}
                  {section === 'Comercial' && <Comercial permisos={permisos} seleccionWindow={seleccionWindow} />}


                  {/* Calidad */}
                  {/* ingresos formularios */}
                  {section === "Calidad/ingresos_formularios" && <IngresosFormulariosCalidad permisos={permisos} seleccionWindow={seleccionWindow} />}
                  {section === "Calidad/ingresos_calidad" && <IngresosCalidad permisos={permisos} seleccionWindow={seleccionWindow} />}

                  {section === "66b6701177549ed0672a9022" && <IngresoClasificacionCalidad />}
                  {section === "66c5130bb51eef12da89050e" && <IngresoHigienePersonal />}
                  {section === "66f8228c2d9d7eec9ff11d51" && <IngresarFormularioCalidad />}

                  {/* Aplicaciones */}

                  {section === "Proceso/Aplicaciones" && <Aplicaciones permisos={permisos} seleccionWindow={seleccionWindow} />}
                  {section === "Proceso/historiales_aplicaciones" && <HistorialAplicaciones permisos={permisos} seleccionWindow={seleccionWindow} />}

                  {section === '66b6705a77549ed0672a9026' && <FotosCalidad lote={lote} />}
                  {section === '66b6706477549ed0672a9027' && <DescarteLavado />}
                  {section === '66b6706e77549ed0672a9028' && <DescarteEncerado />}
                  {section === '66b6707777549ed0672a9029' && <ListaDeEmpaque setSection={setSection} />}

                  {/* Historiales aplicaciones */}
                  {section === '66b6708677549ed0672a902a' && <HistorialDescarteLavadoProceso />}
                  {section === '66b6708f77549ed0672a902b' && <HistorialDescarteEnceradoProceso />}
                  {section === '66b6709877549ed0672a902c' && <HistorialFotosCalidad />}

                  {/* comercial */}
                  {section === "Comercial/Proveedores" && <Proveedores permisos={permisos} seleccionWindow={seleccionWindow} />}
                  {section === '66b670ca77549ed0672a9030' && <InfoProveedores />}

                  {/* inventario y logistica */}
                  {section === "Inventario y Logística/inventarios" && <Inventarios permisos={permisos} seleccionWindow={seleccionWindow} />}

                  {section === "66b66e8d77549ed0672a9015" && <InventarioFrutaSinProcesar />}
                  {section === "66b66eb677549ed0672a9017" && <InventarioDesverdizado />}
                  {section === "66b66ece77549ed0672a9018" && <OrdenVaceo />}

                </View>
            }
            <LoadingModal visible={loading} />

          </SafeAreaView>
        </deviceWidth.Provider>
      </stackContext.Provider>
    </envContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default App;
