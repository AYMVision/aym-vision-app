// src/ai/core/transformersConfig.ts
import { env } from '@xenova/transformers';

const BASE = import.meta.env.BASE_URL || '/';

env.allowRemoteModels = false;                      // 🔒 kein Remote
env.localModelPath = `${BASE}models/`;              // ✅ trailing slash wichtig
env.backends.onnx.wasm.wasmPaths = `${BASE}wasm/`;  // ✅ trailing slash wichtig

// PWA/Browser-stabil
env.backends.onnx.wasm.numThreads = 1;
