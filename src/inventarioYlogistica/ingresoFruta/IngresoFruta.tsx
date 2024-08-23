/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import * as strings from './json/strings_ES.json';
import { crear_request_guardar, formInit, request_EF1, request_predios } from './functions/functions';
import { proveedoresType } from '../../../types/proveedoresType';
import { Alert, Text, View, TouchableOpacity, StyleSheet } from 'react-native';


//recordar despues cambiar para que inventario quede en un item aparte, pues canastilla en inventario va a caqmbiar a un solo json
export default function IngresoFruta(): React.JSX.Element {
  const [prediosDatos, setPrediosData] = useState<proveedoresType[]>([]);
  const [formState, setFormState] = useState(formInit);
  const [enf, setEnf] = useState('');
  const [reload, setReload] = useState<boolean>(false);

  // const obtenerEF1 = async (): Promise<void> => {
  //   // const enf = await window.api.server2(request_EF1);
  //   // setEnf(enf.response);
  // };
  // const obtenerPredios = async (): Promise<void> => {
  //   try {
  //     const response = await window.api.server2(request_predios)
  //     if (response.status !== 200) throw new Error(`Cose ${response.status}: ${response.message}`)
  //     const data1 = handleServerResponse(response, messageModal)

  //     if (Array.isArray(data1) && data1.length > 0 && '_id' in data1[0]) {
  //       setPrediosData(data1 as proveedoresType[]);
  //     }
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       messageModal("error", `${err.message}`)

  //     }
  //   }
  // }
  // useEffect(() => {
  //   obtenerPredios()
  //   obtenerEF1()
  // }, []);
  // const handleChange = (event): void => {
  //   const { name, value } = event.target;

  //   const uppercaseValue = name === 'placa' ? value.toUpperCase() : value;

  //   setFormState({
  //     ...formState,
  //     [name]: uppercaseValue,
  //   });
  // };
  // const guardarLote: React.FormEventHandler<HTMLFormElement> = async (event) => {
  //   try {
  //     event.preventDefault();
  //     const datos = crear_request_guardar(formState);
  //     if (datos.promedio < 15 || datos.promedio > 30) {
  //       Alert.alert('Error, los kilos no corresponden a las canastillas');
  //       return;
  //     }
  //     if (!datos.tipoFruta) {
  //       Alert.alert('Seleccione el tipo de fruta del lote');
  //       return;
  //     }
  //     const data = { ...datos, enf: enf };
  //     const request = {
  //       data: data,
  //       action: 'guardarLote',
  //       record: 'crearLote',
  //     };
  //     // const response = await window.api.server2(request)
  //     if (response.status !== 200) {
  //       throw new Error(response.message);
  //     }
  //     Alert.alert("Guardado con exito");
  //     reiniciarCampos();
  //   } catch (e) {
  //     Alert.alert('Recepcion' + e);
  //   }
  // };
  // const reiniciarCampos = (): void => {
  //   setFormState(formInit);
  // };

  return (
    <View>
      <View>
        <Text>{strings.title}</Text>
        <Text>{enf}</Text>
      </View>

      <View>
        <TouchableOpacity style={styles.botonLotes}>
          <Text>{formState.nombrePredio}</Text>
        </TouchableOpacity>
      </View>
      <div>
        <label> Tipo fruta</label>
        <select
          className='defaultSelect'
          onChange={handleChange}
          required
          name='tipoFruta'>
          <option value=""></option>
          <option value="Naranja">{strings.tipoFruta.naranja}</option>
          <option value="Limon">{strings.tipoFruta.limon}</option>
        </select>
      </div>
      <div >
        <label>{strings.numeroRemision}</label>
        <input type="text" onChange={handleChange} name="numeroRemision" value={formState.numeroRemision} required />
      </div>
      <div >
        <label>{strings.numeroPrecintos}</label>
        <input type="text" onChange={handleChange} name="numeroPrecintos" value={formState.numeroPrecintos} required />
      </div>
      <div >
        <label>{strings.numeroCanastillas}</label>
        <input type="text" onChange={handleChange} name="canastillas" value={formState.canastillas} required />
      </div>
      <div >
        <label>{strings.kilos}</label>
        <input type="text" onChange={handleChange} name="kilos" value={formState.kilos} required />
      </div>
      <div >
        <label>{strings.placa}</label>
        <input type="text" onChange={handleChange} name="placa" value={formState.placa} required />
      </div>
      <div >
        <label>{strings.canastillasVacias}</label>
        <input type="text" onChange={handleChange} name="canastillasVacias" value={formState.canastillasVacias} required />
      </div>
      <div >
        <label>{strings.observaciones}</label>
        <textarea onChange={handleChange} name="observaciones" value={formState.observaciones} required />
      </div>
      <div className='defaultSelect-button-div'>
        <button type='submit'>Guardar</button>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  botonLotes: {
    backgroundColor: 'white',
    width: 250,
    height: 50,
    marginLeft: '5%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7D9F3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
