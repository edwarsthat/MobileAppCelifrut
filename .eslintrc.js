module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Añade esta regla para permitir tanto comillas simples como dobles sin restricciones
    "quotes": ['off'],
    "react-hooks/exhaustive-deps": "off"
  },
};
