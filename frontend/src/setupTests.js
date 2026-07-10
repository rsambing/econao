// jest-dom acrescenta matchers personalizados do jest (ex.: toBeInTheDocument())
// que permitem fazer assertions sobre nós do DOM. Ficheiro lido automaticamente
// pelo react-scripts antes de cada suite de testes.
import '@testing-library/jest-dom';

// O ambiente jsdom usado pelo Jest (react-scripts) não define TextEncoder/
// TextDecoder globalmente, mas o react-router-dom v7 precisa deles. Sem isto,
// qualquer teste que importe react-router-dom falha com
// "ReferenceError: TextEncoder is not defined".
import { TextEncoder, TextDecoder } from 'node:util';
if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;
