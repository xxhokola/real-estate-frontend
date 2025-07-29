/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TINYMCE_API_KEY: string;
  // Add other VITE_ vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}