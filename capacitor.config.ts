import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stockmanager.app',
  appName: 'Stock Manager',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;