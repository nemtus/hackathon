import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Resolve the tsconfig `baseUrl: "src"` absolute imports (e.g. 'models/...',
  // 'components/...') natively (Vite 8+).
  resolve: {
    tsconfigPaths: true,
  },
  // Keep the legacy CRA env-var names (REACT_APP_*) so existing secrets and
  // .env.testnet / .env.mainnet files continue to work unchanged.
  envPrefix: 'REACT_APP_',
  build: {
    // Emit to build/ (not the Vite default dist/) so firebase.json hosting
    // (public: "build") and the CD workflows stay unchanged.
    outDir: 'build',
    target: 'es2020',
  },
  server: {
    port: 3000,
  },
});
