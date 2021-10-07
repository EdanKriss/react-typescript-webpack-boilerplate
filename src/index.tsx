import { validateENV } from '@src/config/process-env';
// throw exception if ENV vars missing
validateENV();

// file-loader simply moves the file into the output dir (dist) at build time, does not add anything to bundle.
require('file-loader?name=[name].[ext]!@src/../index.html');

// code-split imports, produces separate bundles
import('react-toastify/dist/ReactToastify.min.css');
import('@src/styles/global-styles.scss');

require('@src/root.tsx');