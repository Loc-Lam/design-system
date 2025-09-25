/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Test environment configuration
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],

    // Global test configuration
    globals: true,
    css: true,

    // Coverage configuration - MANDATORY 100% COVERAGE
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',

      // CRITICAL: 100% COVERAGE THRESHOLDS - NO EXCEPTIONS
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
        // Per-file thresholds (more strict)
        perFile: true
      },

      // Files to include in coverage
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/lib/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}'
      ],

      // Files to exclude from coverage
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/index.{ts,tsx}', // Re-export files
        'src/test-setup.ts',
        'src/mocks/**/*',
        'src/**/__tests__/**/*',
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '.next/**',
        'build/**'
      ],

      // Coverage reporting options
      all: true,
      skipFull: false
    },

    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**'
    ],

    // Test timeout settings
    testTimeout: 10000,
    hookTimeout: 10000,

    // Reporter configuration
    reporter: ['verbose', 'json', 'html'],

    // Disable test isolation for performance (be careful with shared state)
    isolate: true,

    // Watch mode configuration
    watch: true,

    // UI configuration for @vitest/ui
    ui: true,

    // Benchmark configuration
    benchmark: {
      reporter: ['default']
    }
  },

  // Esbuild options for test compilation
  esbuild: {
    target: 'node14'
  }
});