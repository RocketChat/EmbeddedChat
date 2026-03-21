/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_RC_HOST?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
