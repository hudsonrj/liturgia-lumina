import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.liturgialumina.app',
  appName: 'Liturgia Lumina',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
      keystorePassword: 'liturgialumina',
      keystoreAliasPassword: 'liturgialumina'
    },
    backgroundColor: '#FFFFFF',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    initialFocus: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#FFFFFF',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      overlaysWebView: true,
      backgroundColor: '#FFFFFF'
    }
  }
};

export default config;
