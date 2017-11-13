import { unexport } from 'rollup-plugin-bundleutils';

export default {
  input: 'init-fns.js',
  output: {
    file: 'export/library.js',
    format: 'es'
  },
  plugins: [ unexport() ]
};
