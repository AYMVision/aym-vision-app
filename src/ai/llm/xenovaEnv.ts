// src/ai/llm/xenovaEnv.ts
import { env } from '@xenova/transformers';

const BASE = import.meta.env.BASE_URL || '/';

env.allowRemoteModels = false;
env.localModelPath = `${BASE}models/`;         // wichtig: trailing slash
env.backends.onnx.wasm.wasmPaths = `${BASE}wasm/`;
env.backends.onnx.wasm.numThreads = 1;         // stabil im Browser

if (import.meta.env.DEV) {
  console.log('[xenovaEnv] BASE=', BASE);
  console.log('[xenovaEnv] localModelPath=', env.localModelPath);
  console.log('[xenovaEnv] wasmPaths=', env.backends.onnx.wasm.wasmPaths);
}
