import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => ({
  // Relative base so the bundle loads inside a Crazy Games (or Pages) iframe
  // regardless of the host path.
  base: './',
  resolve: {
    alias: { 'three/addons/': path.resolve(__dirname, 'node_modules/three/examples/jsm/') },
  },
  preview: { host: '0.0.0.0', allowedHosts: true },
  server: { host: '0.0.0.0', allowedHosts: true },
  build: {
    outDir: mode === 'crazygames' ? 'dist-crazygames' : 'dist',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'strip-alteru-guest-shell',
      apply: 'build',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          if (mode !== 'crazygames') return html;
          return html.replace(
            /\s*<script src="https:\/\/images\.aiwaves\.tech\/alteru\/guest-shell\.js" defer><\/script>/,
            '',
          );
        },
      },
    },
  ],
}));
