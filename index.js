import { AppRegistry } from 'react-native';
import App from './src/app';  // Mengarah ke src/App.js
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
